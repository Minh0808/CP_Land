import React, { useEffect, useState, ChangeEvent, FormEvent, useRef } from 'react';
import styled from 'styled-components';
import {
   createPost,
   deletePost,
   editPost,
   fetchPosts,
   PostDTO,
   uploadImage,
   UploadResult,
} from '../API/api';
import { ProvinceItem, DistrictItem, WardItem } from '../types/interface';
import treeData from '../Data/hanhchinhVN/tree.json';
import { NumericFormat, NumberFormatValues } from 'react-number-format';

interface ImageWithKey extends UploadResult {
   url: string;
   key: string;
   contentType: string;
}

// --- 1) Định nghĩa kiểu cho JSON administrative tree ---
type RawWard = {
   code: string;
   name: string;
};

type RawDistrict = {
   code: string;
   name: string;
   'xa-phuong'?: Record<string, RawWard>;
};

type RawProvince = {
   code: string;
   name: string;
   'quan-huyen'?: Record<string, RawDistrict>;
};

type RawTree = Record<string, RawProvince>;

const rawTree = treeData as RawTree;

// --- 2) Interface cho Address ---
interface Address {
   provinceCode: string;
   provinceName: string;
   districtCode: string;
   districtName: string;
   wardCode: string;
   wardName: string;
   street: string;
}

const PostCreate: React.FC = () => {
   // flag để bật/tắt form
   const [showForm, setShowForm] = useState(false);

   // 1. State form cơ bản
   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');
   const [propertyType, setPropertyType] = useState('');
   const [price, setPrice] = useState<number | ''>('');
   const [area, setArea] = useState<number | ''>('');
   const [posts, setPosts] = useState<PostDTO[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [editId, setEditId] = useState<string | null>(null);
   const [refreshCount, setRefreshCount] = useState(0);
   const formRef = useRef<HTMLDivElement>(null);
   const [submitting, setSubmitting] = useState(false)
   // 2. State cho địa chỉ (3 cấp)
   const [allProvinces, setAllProvinces] = useState<ProvinceItem[]>([]);
   const [allDistricts, setAllDistricts] = useState<DistrictItem[]>([]);
   const [allWards, setAllWards] = useState<WardItem[]>([]);
   const [address, setAddress] = useState<Address>({
      provinceCode: '',
      provinceName: '',
      districtCode: '',
      districtName: '',
      wardCode: '',
      wardName: '',
      street: '',
   });

   // 3. State cho file ảnh
   const [files, setFiles] = useState<File[]>([]);

   // 4. Load provinces khi mount
   useEffect(() => {
      const provinces: ProvinceItem[] = Object.values(rawTree)
         .map((p) => ({
            code: p.code,
            name: p.name,
         }))
         .sort((a, b) => a.name.localeCompare(b.name, 'vi', { sensitivity: 'base' }));
      setAllProvinces(provinces);
   }, []);

   // 5. Khi chọn tỉnh → load quận/huyện
   useEffect(() => {
      if (!address.provinceCode) {
         setAllDistricts([]);
         setAllWards([]);
         return setAddress((prev) => ({
            ...prev,
            districtCode: '',
            districtName: '',
            wardCode: '',
            wardName: '',
         }));
      }

      const prov = rawTree[address.provinceCode];
      const districts: DistrictItem[] = prov?.['quan-huyen']
         ? Object.values(prov['quan-huyen']!).map((d) => ({
              code: d.code,
              name: d.name,
           }))
         : [];

      districts.sort((a, b) => {
         const isNumA = /^\d+$/.test(a.name);
         const isNumB = /^\d+$/.test(b.name);

         if (isNumA && isNumB) {
            // cả hai đều là số → so sánh numeric
            return parseInt(a.name, 10) - parseInt(b.name, 10);
         } else if (isNumA) {
            // A là số, B không phải số → A lên trước
            return -1;
         } else if (isNumB) {
            // B là số, A không phải số → B lên trước
            return 1;
         } else {
            // cả hai đều không phải số → so sánh chuỗi
            return a.name.localeCompare(b.name, 'vi', { sensitivity: 'base' });
         }
      });
      setAllDistricts(districts);
   }, [address.provinceCode]);

   // 6. Khi chọn quận/huyện → load phường/xã
   useEffect(() => {
      if (!address.districtCode) {
         setAllWards([]);
         return setAddress((prev) => ({
            ...prev,
            wardCode: '',
            wardName: '',
         }));
      }

      const prov = rawTree[address.provinceCode];
      const rawDistrict = prov?.['quan-huyen']?.[address.districtCode];
      const wards: WardItem[] = rawDistrict?.['xa-phuong']
         ? Object.values(rawDistrict['xa-phuong']).map((w) => ({
              code: w.code,
              name: w.name,
           }))
         : [];

      wards.sort((a, b) => a.name.localeCompare(b.name, 'vi', { sensitivity: 'base' }));
      setAllWards(wards);
   }, [address.districtCode, address.provinceCode]);

   // 7. Xử lý chọn file
   const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) {
         setFiles([]);
         return;
      }
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
   };

   // 8. Submit form
   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      if (
         !title ||
         !propertyType ||
         price === '' ||
         area === '' ||
         !address.provinceCode ||
         !address.districtCode ||
         !address.wardCode ||
         setFiles.length === 0
      ) {
         alert('Vui lòng điền đủ thông tin bắt buộc và chọn ít nhất 1 ảnh.');
         return;
      }
      // 1) Upload đồng thời tất cả ảnh
      const results: UploadResult[] = await Promise.all(files.map((file) => uploadImage(file)));

      // 2) Map về ImageWithKey
      const imgs: ImageWithKey[] = results.map((res) => ({
         url: res.url,
         key: res.key,
         contentType: res.contentType,
      }));

      // 3) Build payload JSON
      const payload = {
         title: title.trim(),
         description: description.trim(),
         propertyType,
         price: Number(price),
         area: Number(area),

         // NESTED ADDRESS
         address: {
            provinceCode: address.provinceCode,
            provinceName: address.provinceName,
            districtCode: address.districtCode,
            districtName: address.districtName,
            wardCode: address.wardCode,
            wardName: address.wardName,
            street: address.street.trim(),
         },

         images: imgs.map((i) => ({
            url: i.url,
            key: i.key,
            contentType: i.contentType,
         })),
      };
      // console.log('Payload:', payload);
      setSubmitting(true);
      // 4) Call API
      try {
         if (editId) {
            await editPost(editId, payload);
            alert('Cập nhật bài đăng thành công!');
         } else {
            await createPost(payload);
            alert('Tạo bài đăng thành công!');
         }
         setEditId(null);
         setShowForm(false);
         setRefreshCount((c) => c + 1);
      }finally {
         setSubmitting(false);
      }
   };

   const resetForm = () => {
      setTitle('');
      setDescription('');
      setPropertyType('');
      setPrice('');
      setArea('');
      setAddress({
         provinceCode: '',
         provinceName: '',
         districtCode: '',
         districtName: '',
         wardCode: '',
         wardName: '',
         street: '',
      });
      setFiles([]);
      setEditId(null);
   };

   // 9. Hủy form
   const handleCancel = () => {
      setShowForm(false);
   };

   useEffect(() => {
      setLoading(true);
      fetchPosts()
         .then((data) => {
            setPosts(data);
            setError(null);
         })
         .catch((err) => {
            console.error('Lỗi fetch posts:', err);
            setError('Không thể tải danh sách bài đăng.');
         })
         .finally(() => {
            setLoading(false);
         });
      resetForm();
   }, [refreshCount]);

   const handleEditClick = (posts: PostDTO) => {
      setShowForm(true);
      setEditId(posts.id);
      setTitle(posts.title);
      setDescription(posts.description || '');
      setPropertyType(posts.propertyType);
      setPrice(posts.price);
      setArea(posts.area);
      setAddress({
         provinceCode: posts.address.provinceCode,
         provinceName: posts.address.provinceName,
         districtCode: posts.address.districtCode,
         districtName: posts.address.districtName,
         wardCode: posts.address.wardCode,
         wardName: posts.address.wardName,
         street: posts.address.street,
      });
      setFiles([]);
   };

   const handleDeleteClick = async (postId: PostDTO['id']) => {
      // console.log('Payload sẽ gửi:', imageKeys);
      const ok = window.confirm('Bạn có chắc muốn xoá bài này không?');
      if (!ok) return;

      try {
         // Xóa bài đăng
         await deletePost(postId);
         alert('Xóa thành công!');
         // cũng bật lại effect fetch
         setRefreshCount((c) => c + 1);
      } catch {
         alert('Xóa thất bại');
      }
      // console.log('imageKey sau khi xoá', imageKeys);
   };

   useEffect(() => {
      function onDocumentClick(e: MouseEvent) {
         // Nếu đang show form và click ngoài formRef
         if (showForm && formRef.current && !formRef.current.contains(e.target as Node)) {
            handleCancel();
            resetForm();
         }
      }

      document.addEventListener('mousedown', onDocumentClick);
      return () => {
         document.removeEventListener('mousedown', onDocumentClick);
      };
   }, [showForm]);

   return (
      <OuterContainer>
         <Grid>
            {loading && (
               <div>
                  {/* ở đây bạn có thể thay bằng spinner */}
                  <p>Loading...</p>
               </div>
            )}

            {/* 2. Nếu có error thì show lỗi */}
            {!loading && error && (
               <div>
                  <p style={{ color: 'red' }}>{error}</p>
               </div>
            )}
            {posts.map((post) => {
               const img = post.images?.[0];
               const thumbUrl = img ? img.url : '';
               return (
                  <Card key={post.id}>
                     {thumbUrl ? (
                        <Image src={thumbUrl} alt={post.title} />
                     ) : (
                        <Placeholder>No Image</Placeholder>
                     )}
                     <CardBody>
                        <Title>{post.title}</Title>
                        <Meta>
                           <span>Giá: {post.price.toLocaleString()} ₫</span>
                           <span>Diện tích: {post.area} m²</span>
                        </Meta>
                        <Address>
                           {post.address.street && `${post.address.street}, `}
                           {post.address.wardName}, {post.address.districtName},{' '}
                           {post.address.provinceName}
                        </Address>
                        <DateStr>
                           Đăng ngày:{' '}
                           {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                           })}
                        </DateStr>
                        <Actions>
                           <ActionBtn onClick={() => handleEditClick(post)}>Sửa</ActionBtn>
                           <ActionBtnDelete onClick={() => handleDeleteClick(post.id)}>
                              Xóa
                           </ActionBtnDelete>
                        </Actions>
                     </CardBody>
                  </Card>
               );
            })}
         </Grid>
         {!showForm && <OpenBtn onClick={() => setShowForm(true)}>Đăng tin mới</OpenBtn>}
         {showForm && (
            <FormContainer ref={formRef}>
               <h2>Đăng bán bất động sản</h2>
               <Form onSubmit={handleSubmit}>
                  {/* 1) Tiêu đề */}
                  <FormGroup>
                     <Label>Tiêu đề (*)</Label>
                     <Input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                     />
                  </FormGroup>

                  {/* 2) Mô tả */}
                  <FormGroup>
                     <Label>Mô tả</Label>
                     <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                     />
                  </FormGroup>

                  {/* 3) Loại hình BĐS */}
                  <FormGroup>
                     <Label>Loại hình (*)</Label>
                     <Select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        required
                     >
                        <option value="">-- Chọn loại hình --</option>
                        <option value="can-ho/chung-cu">Căn hộ/Chung cư</option>
                        <option value="dat-nen">Đất nền</option>
                        <option value="nha-pho">Nhà phố</option>
                        <option value="biet-thu">Biệt thự</option>
                        <option value="van-phong/mat-bang">Văn phòng/Mặt bằng</option>
                        <option value="khac">Khác</option>
                     </Select>
                  </FormGroup>

                  {/* 4) Giá */}
                  <FormGroup>
                     <Label htmlFor="price-slider">Giá (VNĐ) (*)</Label>
                     <SliderWrapper>
                        <SliderNav
                           id="price-slider"
                           min={0}
                           max={100_000_000_000}
                           step={1000_000}
                           value={price}
                           onChange={(e) => setPrice(+e.target.value)}
                        />

                        <NumericFormat
                           thousandSeparator="."
                           decimalSeparator=","
                           suffix=" ₫"
                           value={price === '' ? 0 : price}
                           onValueChange={(values: NumberFormatValues) => {
                              setPrice(values.floatValue ?? 0);
                           }}
                           customInput={ValueDisplay}
                        />
                     </SliderWrapper>
                  </FormGroup>

                  {/* 5) Diện tích */}
                  <FormGroup>
                     <Label>Diện tích (m²) (*)</Label>
                     <Input
                        type="number"
                        min="1"
                        step="1"
                        value={area}
                        onChange={(e) =>
                           setArea(e.target.value === '' ? '' : Number(e.target.value))
                        }
                        required
                     />
                  </FormGroup>

                  {/* 6) Tỉnh/Thành */}
                  <FormGroup>
                     <Label>Tỉnh/Thành (*)</Label>
                     <Select
                        value={address.provinceCode}
                        onChange={(e) => {
                           const code = e.target.value;
                           const found = allProvinces.find((p) => p.code === code);
                           setAddress((prev) => ({
                              ...prev,
                              provinceCode: code,
                              provinceName: found?.name || '',
                           }));
                        }}
                        required
                     >
                        <option value="">-- Chọn tỉnh/thành --</option>
                        {allProvinces.map((prov) => (
                           <option key={prov.code} value={prov.code}>
                              {prov.name}
                           </option>
                        ))}
                     </Select>
                  </FormGroup>

                  {/* 7) Quận/Huyện */}
                  {allDistricts.length > 0 && (
                     <FormGroup>
                        <Label>Quận/Huyện (*)</Label>
                        <Select
                           value={address.districtCode}
                           onChange={(e) => {
                              const code = e.target.value;
                              const found = allDistricts.find((d) => d.code === code);
                              setAddress((prev) => ({
                                 ...prev,
                                 districtCode: code,
                                 districtName: found?.name || '',
                              }));
                           }}
                           required
                        >
                           <option value="">-- Chọn quận/huyện --</option>
                           {allDistricts.map((dist) => (
                              <option key={dist.code} value={dist.code}>
                                 {dist.name}
                              </option>
                           ))}
                        </Select>
                     </FormGroup>
                  )}

                  {/* 8) Phường/Xã */}
                  {allWards.length > 0 && (
                     <FormGroup>
                        <Label>Phường/Xã (*)</Label>
                        <Select
                           value={address.wardCode}
                           onChange={(e) => {
                              const code = e.target.value;
                              const found = allWards.find((w) => w.code === code);
                              setAddress((prev) => ({
                                 ...prev,
                                 wardCode: code,
                                 wardName: found?.name || '',
                              }));
                           }}
                           required
                        >
                           <option value="">-- Chọn phường/xã --</option>
                           {allWards.map((ward) => (
                              <option key={ward.code} value={ward.code}>
                                 {ward.name}
                              </option>
                           ))}
                        </Select>
                     </FormGroup>
                  )}

                  {/* 9) Số nhà/Tên đường */}
                  <FormGroup>
                     <Label>Số nhà/Tên đường</Label>
                     <Input
                        type="text"
                        value={address.street}
                        onChange={(e) =>
                           setAddress((prev) => ({ ...prev, street: e.target.value }))
                        }
                     />
                  </FormGroup>

                  {/* 10) Hình ảnh */}
                  <FormGroup>
                     <Label>Chọn ảnh (*)</Label>
                     <FileWrapper>
                        <FileLabel htmlFor="file-input">Chọn ảnh…</FileLabel>
                        <InputFile
                           id="file-input"
                           type="file"
                           multiple
                           accept="image/*"
                           onChange={handleFileSelect}
                           required={!editId}
                           placeholder=""
                        />
                        {files.length > 0 && (
                           <PreviewContainer>
                              {files.map((file, idx) => (
                                 <PreviewImg
                                    key={idx}
                                    src={URL.createObjectURL(file)}
                                    alt={`preview-${idx}`}
                                 />
                              ))}
                           </PreviewContainer>
                        )}
                     </FileWrapper>
                  </FormGroup>
                  {/* 11) Nút Lưu / Hủy */}
                  <ActionsBottom>
                     <Button type="submit" disabled={submitting}>{submitting ? 'Đang lưu…' : 'Lưu'}</Button>
                     <CancelBtn type="button" onClick={handleCancel}>
                        Hủy
                     </CancelBtn>
                  </ActionsBottom>
               </Form>
            </FormContainer>
         )}
      </OuterContainer>
   );
};

export default PostCreate;

/* ==================== Styled Components ==================== */

const SliderWrapper = styled.div`
   display: flex;
   align-items: center;
`;

const SliderNav = styled.input.attrs({ type: 'range' })`
   flex: 1;
   margin-right: 1rem;
`;

const ValueDisplay = styled.input.attrs({ type: 'text', inputMode: 'numeric' })`
   min-width: 80px;
   text-align: right;
   font-weight: 500;
   margin-left: 8px;
   border: 1px solid #ccc;
   border-radius: 4px;
   padding: 2px 4px;
   /* border: none; */

   &:focus {
      outline: none;
      border-color: #007bff;
   }
`;
const OuterContainer = styled.div`
   max-width: 80%;
   margin: 40px auto;
   padding: 0 16px;
`;

const OpenBtn = styled.button`
   display: block;
   margin: 20px auto;
   padding: 10px 20px;
   background-color: #28a745;
   color: #fff;
   border: none;
   border-radius: 4px;
   font-size: 16px;
   cursor: pointer;
`;

const FormContainer = styled.div`
   position: fixed;
   top: 64px;
   bottom: 0;
   left: 50%;
   transform: translateX(-50%);
   width: 47%;
   padding: 24px;
   background-color: #fdfdfd;
   border-radius: 8px;
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
   overflow-y: auto;
`;

const Form = styled.form`
   display: flex;
   flex-direction: column;
   gap: 16px;
`;

const FormGroup = styled.div`
   display: flex;
   flex-direction: column;
`;

const Label = styled.label`
   font-weight: 500;
   margin-bottom: 4px;
`;

const Input = styled.input`
   padding: 8px 12px;
   border: 1px solid #ccc;
   border-radius: 4px;
   font-size: 14px;

   &:focus {
      outline: none;
      border-color: #007bff;
   }
`;

const InputFile = styled.input`
   font-size: 14px;
   margin-top: 4px;
`;

const Textarea = styled.textarea`
   padding: 8px 12px;
   border: 1px solid #ccc;
   border-radius: 4px;
   font-size: 14px;
   resize: vertical;

   &:focus {
      outline: none;
      border-color: #007bff;
   }
`;

const Select = styled.select`
   padding: 8px 12px;
   border: 1px solid #ccc;
   border-radius: 4px;
   font-size: 14px;
   appearance: none;
   background-color: #fff;
   background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2210%22%20height%3D%227%22%20viewBox%3D%220%200%2010%207%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200l5%207%205-7z%22%20fill%3D%22%23888%22/%3E%3C/svg%3E');
   background-repeat: no-repeat;
   background-position: right 12px center;
   background-size: 10px 7px;

   &:focus {
      outline: none;
      border-color: #007bff;
   }
`;

const PreviewContainer = styled.div`
   display: flex;
   flex-wrap: wrap;
   gap: 8px;
   margin-top: 8px;
`;

const PreviewImg = styled.img`
   width: 80px;
   height: 80px;
   object-fit: cover;
   border-radius: 4px;
   border: 1px solid #ccc;
`;

const Button = styled.button`
   padding: 10px 16px;
   background-color: #007bff;
   color: white;
   font-size: 15px;
   font-weight: 500;
   border: none;
   border-radius: 4px;
   cursor: pointer;

   &:hover {
      background-color: #0069d9;
   }

   &:disabled {
      background-color: #90caf9;
      cursor: not-allowed;
   }
`;

const ActionsBottom = styled.div`
   display: flex;
   justify-content: flex-end;
   gap: 12px;
`;

const CancelBtn = styled.button`
   background-color: #6c757d;
   color: #fff;
   border: none;
   padding: 10px 16px;
   border-radius: 4px;
   cursor: pointer;
`;
const FileWrapper = styled.div`
   background: #fff;
   padding: 12px;
   border: 1px solid #ccc;
   border-radius: 4px;
   box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
   margin-top: 4px;
   display: flex;
   gap: 8px;
   align-items: center;
`;

const FileLabel = styled.label`
   display: inline-block;
   padding: 8px 16px;
   background-color: #007bff;
   color: white;
   border-radius: 4px;
   cursor: pointer;
   font-size: 14px;

   &:hover {
      background-color: #0069d9;
   }
`;
const Actions = styled.div`
   display: flex;
   justify-content: center;
   gap: 8px;
   padding: 8px 16px 16px;
`;

const ActionBtn = styled.button`
   background: #007bff;
   color: white;
   border: none;
   padding: 6px 12px;
   border-radius: 4px;
   cursor: pointer;
   font-size: 14px;

   &:hover {
      background: #0056b3;
   }
`;

const ActionBtnDelete = styled(ActionBtn)`
   background: #dc3545;
   &:hover {
      background: #a71d2a;
   }
`;
const Card = styled.div`
   background: #fff;
   border: 2px solid #ddd;
   border-radius: 4px;
   overflow: hidden;
   box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
   cursor: pointer;
   width: 100%;
   height: 100%;
   transition:
      border-color 0.15s ease-in-out,
      transform 0.15s;
   &:hover {
      border-bottom: 2px solid #ff6600;
   }
`;

const Image = styled.img`
   width: 100%;
   height: 180px;
   object-fit: cover;
   background-color: #f2f2f2;
`;

const Placeholder = styled.div`
   width: 100%;
   height: 180px;
   display: flex;
   align-items: center;
   justify-content: center;
   background-color: #e0e0e0;
   color: #888;
   font-size: 14px;
`;

const CardBody = styled.div`
   padding: 12px 16px;
   display: flex;
   flex-direction: column;
   flex: 1;
`;

const Title = styled.h3`
   font-size: 18px;
   margin: 0 0 8px;
   color: #333;
`;

const Meta = styled.div`
   font-size: 14px;
   color: #555;
   display: flex;
   justify-content: space-between;
   margin-bottom: 8px;
`;

const Address = styled.p`
   font-size: 14px;
   color: #555;
   margin: 4px 0;
`;

const DateStr = styled.p`
   font-size: 12px;
   color: #888;
   margin-top: auto;
   text-align: right;
`;
const Grid = styled.div`
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
   gap: 24px;
`;

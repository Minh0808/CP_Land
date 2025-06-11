// src/pages/PostCreate.tsx

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import styled from "styled-components";
import { api } from "../API/api"; // axios instance đã cấu hình baseURL
import { ProvinceItem, DistrictItem, WardItem } from "../types/interface";
import treeData from "../Data/hanhchinhVN/tree.json";

// Interface cho Address (giống như types/interface.ts)
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
  // ————— 1. State form cơ bản —————
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [area, setArea] = useState<number | "">("");

  // ————— 2. State cho địa chỉ (3 cấp) —————
  const [allProvinces, setAllProvinces] = useState<ProvinceItem[]>([]);
  const [allDistricts, setAllDistricts] = useState<DistrictItem[]>([]);
  const [allWards, setAllWards] = useState<WardItem[]>([]);
  const [address, setAddress] = useState<Address>({
    provinceCode: "",
    provinceName: "",
    districtCode: "",
    districtName: "",
    wardCode: "",
    wardName: "",
    street: "",
  });

  // ————— 3. State cho việc lưu File(s) ảnh —————
  const [files, setFiles] = useState<File[]>([]);

  // ————— 4. Khởi tạo danh sách provinces khi mount —————
  useEffect(() => {
    const provincesArray = Object.values(treeData) as ProvinceItem[];
    setAllProvinces(provincesArray);
  }, []);

  // ————— 5. Khi chọn tỉnh → load quận/huyện —————
  useEffect(() => {
    if (!address.provinceCode) {
      setAllDistricts([]);
      setAllWards([]);
      setAddress((prev) => ({
        ...prev,
        districtCode: "",
        districtName: "",
        wardCode: "",
        wardName: "",
      }));
      return;
    }
    const provObj = (treeData as Record<string, any>)[address.provinceCode];
    if (provObj && provObj["quan-huyen"]) {
      const districtArray = Object.values(
        provObj["quan-huyen"]
      ) as DistrictItem[];
      setAllDistricts(districtArray);
    } else {
      setAllDistricts([]);
    }
    setAllWards([]);
    setAddress((prev) => ({
      ...prev,
      districtCode: "",
      districtName: "",
      wardCode: "",
      wardName: "",
    }));
  }, [address.provinceCode]);

  // ————— 6. Khi chọn quận/huyện → load phường/xã —————
  useEffect(() => {
    if (!address.districtCode) {
      setAllWards([]);
      setAddress((prev) => ({
        ...prev,
        wardCode: "",
        wardName: "",
      }));
      return;
    }
    const foundDist = allDistricts.find(
      (d) => d.code === address.districtCode
    );
    if (foundDist && (foundDist as any)["xa-phuong"]) {
      const wardArray = Object.values(
        (foundDist as any)["xa-phuong"]
      ) as WardItem[];
      setAllWards(wardArray);
    } else {
      setAllWards([]);
    }
    setAddress((prev) => ({
      ...prev,
      wardCode: "",
      wardName: "",
    }));
  }, [address.districtCode, allDistricts]);

  // ————— 7. Xử lý khi user chọn file —————
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      setFiles([]);
      return;
    }
    const arr = Array.from(e.target.files);
    setFiles(arr);
  };

  // ————— 8. Submit form (FormData) —————
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 8.1 Kiểm tra bắt buộc
    if (
      !title ||
      !propertyType ||
      price === "" ||
      area === "" ||
      !address.provinceCode ||
      !address.provinceName ||
      !address.districtCode ||
      !address.districtName ||
      !address.wardCode ||
      !address.wardName ||
      files.length === 0
    ) {
      alert("Vui lòng điền đủ thông tin bắt buộc và chọn ít nhất 1 ảnh.");
      return;
    }

    // 8.2 Tạo FormData, append fields + file ảnh
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("propertyType", propertyType);
    formData.append("price", String(price));
    formData.append("area", String(area));
    formData.append("provinceCode", address.provinceCode);
    formData.append("provinceName", address.provinceName);
    formData.append("districtCode", address.districtCode);
    formData.append("districtName", address.districtName);
    formData.append("wardCode", address.wardCode);
    formData.append("wardName", address.wardName);
    formData.append("street", address.street.trim());

    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      // 8.3 Gửi request, để Axios tự sinh đúng Content-Type + boundary
      const response = await api.post("/posts", formData);
      if (response.status === 201) {
        alert("Tạo bài đăng thành công!");
        // Reset form
        setTitle("");
        setDescription("");
        setPropertyType("");
        setPrice("");
        setArea("");
        setFiles([]);
        setAddress({
          provinceCode: "",
          provinceName: "",
          districtCode: "",
          districtName: "",
          wardCode: "",
          wardName: "",
          street: "",
        });
      }
    } catch (err: any) {
      console.error("Lỗi tạo bài đăng:", err.response || err);
      alert("Có lỗi xảy ra khi tạo bài đăng. Vui lòng kiểm tra console.");
    }
  };

  return (
    <Container>
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
          <Label>Giá (VNĐ) (*)</Label>
          <Input
            type="number"
            min="0"
            step="100000"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            required
          />
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
              setArea(e.target.value === "" ? "" : Number(e.target.value))
            }
            required
          />
        </FormGroup>

        {/* 6) Địa chỉ: Tỉnh/Thành */}
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
                provinceName: found?.name || "",
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
                  districtName: found?.name || "",
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
                  wardName: found?.name || "",
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

        {/* 10) Hình ảnh (upload từ thiết bị) */}
        <FormGroup>
          <Label>Chọn ảnh (*)</Label>
          <InputFile
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            required
          />
          <SmallText>Chọn tối đa 6 ảnh, mỗi ảnh ≤ 5MB.</SmallText>
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
        </FormGroup>

        {/* 11) Nút Đăng tin */}
        <FormGroup>
          <Button type="submit">Đăng tin</Button>
        </FormGroup>
      </Form>
    </Container>
  );
};

export default PostCreate;

/* ==================== Styled Components ==================== */

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 0 16px;
  background-color: #fdfdfd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

const SmallText = styled.span`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
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
  background-image: url(
    "data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2210%22%20height%3D%227%22%20viewBox%3D%220%200%2010%207%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200l5%207%205-7z%22%20fill%3D%22%23888%22/%3E%3C/svg%3E"
  );
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

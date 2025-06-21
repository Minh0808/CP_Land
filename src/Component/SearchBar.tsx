/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/Searchbar/index.tsx

import React, { useState, FormEvent, useEffect } from "react";
import styled from "styled-components";
import {
  ProvinceItem,
  DistrictItem,
  WardItem,
  SearchbarProps,
  SearchbarQuery,
} from "types/interface";

// Import JSON treeData (object)
import treeData from "../Data/hanhchinhVN/tree.json";

const Searchbar: React.FC<SearchbarProps> = ({ onSearch }) => {
  // ─────────────────────────────────────────────
  // 1. State lưu trữ giá trị user chọn
  // ─────────────────────────────────────────────
  const [keyword, setKeyword] = useState<string>("");                  // Từ khóa
  const [selectedProvince, setSelectedProvince] = useState<string>(""); // Mã tỉnh (ví dụ "89")
  const [selectedDistrict, setSelectedDistrict] = useState<string>(""); // Mã quận/huyện (ví dụ "883")
  const [selectedWard, setSelectedWard] = useState<string>("");         // Mã phường/xã (ví dụ "30280")

  // ─────────────────────────────────────────────
  // 2. State để chứa mảng hiển thị
  // ─────────────────────────────────────────────
  const [allProvinces, setAllProvinces] = useState<ProvinceItem[]>([]);
  const [allDistricts, setAllDistricts] = useState<DistrictItem[]>([]);
  const [allWards, setAllWards] = useState<WardItem[]>([]);

  // ─────────────────────────────────────────────
  // 3. Khi component mount: chuyển treeData (object) → array ProvinceItem[]
  // ─────────────────────────────────────────────
  useEffect(() => {
    // treeData có dạng: { "89": {...}, "01": {...}, ... }
    // Ta chỉ cần { code, name } để dropdown
    const provincesArray = Object.values(treeData).map((provObj: any) => ({
      code: provObj.code,
      name: provObj.name,
    })) as ProvinceItem[];

    setAllProvinces(provincesArray);
  }, []);

  // ─────────────────────────────────────────────
  // 4. Khi user chọn tỉnh → “lọc” danh sách quan-huyen
  // ─────────────────────────────────────────────
  useEffect(() => {
    // Nếu user chọn lại “-- Chọn tỉnh --” (value === "")
    if (!selectedProvince) {
      setAllDistricts([]);
      setSelectedDistrict("");
      setAllWards([]);
      setSelectedWard("");
      return;
    }

    // Lấy object Province đầy đủ từ treeData
    const provFull = (treeData as Record<string, any>)[selectedProvince];
    if (provFull && provFull["quan-huyen"]) {
      // provFull["quan-huyen"] là object { "883": {...}, "884": {...}, ... }
      const districtArray = Object.values(provFull["quan-huyen"]).map(
        (distObj: any) => ({
          code: distObj.code,
          name: distObj.name,
        })
      ) as DistrictItem[];

      setAllDistricts(districtArray);
    } else {
      // Không tìm thấy hoặc không có `"quan-huyen"`
      setAllDistricts([]);
    }

    // Reset quận + phường cũ (khi chuyển tỉnh mới)
    setSelectedDistrict("");
    setAllWards([]);
    setSelectedWard("");
  }, [selectedProvince]);

  // ─────────────────────────────────────────────
  // 5. Khi user chọn quận/huyện → “lọc” danh sách xa-phuong
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!selectedDistrict) {
      setAllWards([]);
      setSelectedWard("");
      return;
    }

    // Lấy object Province đầy đủ để truy cập "quan-huyen"
    const provFull = (treeData as Record<string, any>)[selectedProvince];
    if (!provFull || !provFull["quan-huyen"]) {
      setAllWards([]);
      return;
    }

    // Lấy object quận đầy đủ
    const distFull = (provFull["quan-huyen"] as Record<string, any>)[
      selectedDistrict
    ];
    if (distFull && distFull["xa-phuong"]) {
      const wardArray = Object.values(distFull["xa-phuong"]).map(
        (wardObj: any) => ({
          code: wardObj.code,
          name: wardObj.name,
        })
      ) as WardItem[];

      setAllWards(wardArray);
    } else {
      // Không tìm thấy hoặc không có `"xa-phuong"`
      setAllWards([]);
    }

    // Reset phường cũ (khi chọn quận mới)
    setSelectedWard("");
  }, [selectedDistrict, selectedProvince]);

  // ─────────────────────────────────────────────
  // 6. Xử lý Submit (nhấn Enter hoặc click “Tìm”)
  // ─────────────────────────────────────────────
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query: SearchbarQuery = {
      keyword: keyword.trim(),
      provinceCode: selectedProvince,
      districtCode: selectedDistrict,
      wardCode: selectedWard,
    };

    if (onSearch) {
      onSearch(query);
    } else {
      console.log("Tìm kiếm với:", query);
    }
  };

  return (
    <Wrapper>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          width: "100%",
        }}
      >
        {/* ===== 1. Ô nhập từ khóa ===== */}
        <InputContainer>
          <KeywordInput
            type="text"
            placeholder="Nhập từ khóa (ví dụ: căn hộ, nhà phố…)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <SearchIcon>🔍</SearchIcon>
        </InputContainer>

        {/* ===== 2. Dropdown chọn tỉnh/thành ===== */}
        <SelectContainer>
          <RegionSelect
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
          >
            <option value="">-- Chọn tỉnh/thành phố --</option>
            {allProvinces.map((prov) => (
              <option key={prov.code} value={prov.code}>
                {prov.name}
              </option>
            ))}
          </RegionSelect>
        </SelectContainer>

        {/* ===== 3. Dropdown chọn quận/huyện (nếu đã load allDistricts) ===== */}
        {allDistricts.length > 0 && (
          <SelectContainer>
            <RegionSelect
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="">-- Chọn quận/huyện --</option>
              {allDistricts.map((dist) => (
                <option key={dist.code} value={dist.code}>
                  {dist.name}
                </option>
              ))}
            </RegionSelect>
          </SelectContainer>
        )}

        {/* ===== 4. Dropdown chọn phường/xã (nếu đã load allWards) ===== */}
        {allWards.length > 0 && (
          <SelectContainer>
            <RegionSelect
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
            >
              <option value="">-- Chọn phường/xã --</option>
              {allWards.map((ward) => (
                <option key={ward.code} value={ward.code}>
                  {ward.name}
                </option>
              ))}
            </RegionSelect>
          </SelectContainer>
        )}

        {/* ===== 5. Nút Tìm ===== */}
        <SearchButton
          type="submit"
          disabled={keyword.trim() === "" && selectedProvince === ""}
        >
          Tìm
        </SearchButton>
      </form>
    </Wrapper>
  );
};

export default Searchbar;

/* ================================
   Phần styled-components phía dưới
   ================================ */

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px; /* Khoảng cách giữa các phần tử */
  padding: 12px 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const InputContainer = styled.div`
  position: relative;
  flex: 1;           /* Cho phép input chiếm vùng trống */
  max-width: 400px;  /* Giới hạn độ rộng tối đa */

  @media (max-width: 768px) {
    width: 100%;
    max-width: none;
  }
`;

const KeywordInput = styled.input`
  width: 100%;
  padding: 10px 40px 10px 12px; /* left-padding để chừa chỗ icon */
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #888;
`;

const SelectContainer = styled.div`
  flex-shrink: 0; /* Không cho select bị co lại */

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const RegionSelect = styled.select`
  width: 200px;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  appearance: none; /* Loại bỏ style default của browser */
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

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchButton = styled.button`
  flex-shrink: 0;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #0069d9;
  }
  &:disabled {
    background-color: #90caf9;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

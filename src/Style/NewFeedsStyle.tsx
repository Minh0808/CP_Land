import styled from "styled-components";

export const Background = styled.div`
   margin-top  : 100px;
`
// bao ngoài
export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  max-width: 1014px;
  margin: 0 auto;
`

// cột tin lớn
export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`

// mỗi card tin lớn nằm ngang
export const MainCard = styled.a`
   width: 840px;
   display: flex;
   align-items: flex-start;
   gap: 20px;
   background: #fff;
   box-shadow: 0 2px 6px rgba(0,0,0,0.1);
   text-decoration: none;
   color: inherit;
   padding: 10px;
   overflow: hidden;
   box-sizing: border-box;
   border-bottom: 2px solid transparent;
   transition: border-color 0.2s ease;

   img {
      flex: 0 0 246px;
      height: 148px;
      object-fit: cover;
   }

   div {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
   }

   h3 {
      margin: 0 0 8px;
      font-size: 1.3rem;
      font-weight: 600;
      color: #444;
   }
   p {
      margin: 0;
      color: #666;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 3;       /* 3 dòng rồi ... */
      -webkit-box-orient: vertical;
      overflow: hidden;
   }

   &:hover {
      border-bottom: 2px solid #007acc;
   }
`

// cột sidebar
export const Sidebar = styled.aside`
   width: 300px;
   height: 615px;
   display: flex;
   flex-direction: column;
   background: #fff;
   box-shadow: 0 2px 6px rgba(0,0,0,0.1);
   border-radius: 4px;
   overflow: hidden;
`

export const SidebarHeader = styled.div`
  background: #f7931e;
  color: #fff;
  font-weight: bold;
  text-align: center;
  padding: 12px 0;
`

export const SidebarList = styled.div`
  display: flex;
  flex-direction: column;
`

export const SidebarItem = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  text-decoration: none;
  color: #333;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  img {
    flex: 0 0 60px;
    height: 40px;
    object-fit: cover;
    border-radius: 2px;
  }

  span {
    flex: 1;
    font-size: 0.95rem;
    line-height: 1.3;
  }

  &:hover {
    background: #f5f5f5;
  }
`
export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin: 30px 0;
`;

export const PageButton = styled.button<{ $active?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid ${p => (p.$active ? "#005a97" : "#8c8a8a")};
  background: ${p => (p.$active ? "#005a97" : "transparent")};
  color: ${p => (p.$active ? "#fff" : "#666")};
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #005a97;
    border: none;
    color: white
  }
`;

export const ArrowButton = styled(PageButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
`;


import React, { useEffect, useState } from "react"
import styled from "styled-components"
import Searchbar from "../Component/SearchBar"
import PostList from "../Component/PostNew"

function useWindowSize() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return width;
}

const Project: React.FC = () => {
   const width = useWindowSize();
  const isMobile = width < 768;
   return(
      <Wraper>
         {!isMobile && <Searchbar />}
         <PostList/>
      </Wraper>
   )
}
export default Project

const Wraper = styled.div`
   margin-top: 100px;
   width: 100%;
   height: 100%;
`

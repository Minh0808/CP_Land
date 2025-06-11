
import React from "react"
import styled from "styled-components"
import Searchbar from "../Component/SearchBar"
import PostList from "../Component/PostNew"

const Project: React.FC = () => {

   return(
      <Wraper>
         <Searchbar/>
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
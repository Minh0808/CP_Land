import axios from "axios"
import { useState, useEffect } from "react"
import { ArrowButton, Background, MainCard, MainColumn, PageButton, Pagination, Sidebar, SidebarHeader, SidebarItem, SidebarList, Wrapper } from "../Style/NewFeedsStyle"
import { NewsItem } from "../types/interface"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"


const ITEMS_PER_PAGE = 10
const NewFeeds: React.FC = () =>{
   const [news, setNews] = useState<NewsItem[]>([])
   const [currentPage, setCurrentPage] = useState(1);

   useEffect(() => {
    axios
      .get<NewsItem[]>('/rss/hot-real')
      .then(res => setNews(res.data))
      .catch(err => console.error(err))
  }, [])

   const totalPages = Math.ceil(news.length / ITEMS_PER_PAGE)
   const mainNews = news.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
      )
  const sideNews = news.slice(0, 8)

   return(
      <Background>
         <Wrapper>
            <MainColumn>
               {mainNews.map((n, i) => (
                  <MainCard key={i} href={n.link} target="_blank" rel="noreferrer">
                     {n.image && <img src={n.image} alt={n.title} />}
                     <div>
                        <h3>{n.title}</h3>
                        <p>{n.summary}</p>
                     </div>
                  </MainCard>
               ))}
               <Pagination>
                  {currentPage > 1 && (
                     <ArrowButton onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>
                        <FaChevronLeft/>
                     </ArrowButton>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => (
                     <PageButton
                        key={i + 1}
                        $active={currentPage === i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                     >
                        {i + 1}
                     </PageButton>
                  ))}

                  {currentPage < totalPages && (
                     <ArrowButton onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>
                        <FaChevronRight/>
                     </ArrowButton>
                  )}
               </Pagination>
            </MainColumn>
            <Sidebar>
               <SidebarHeader>TIN TỨC MỚI</SidebarHeader>
               <SidebarList>
                  {sideNews.map((n, i) => (
                     <SidebarItem key={i} href={n.link} target="_blank" rel="noreferrer">
                        {n.image && <img src={n.image} alt={n.title} />}
                        <span>{n.title}</span>
                     </SidebarItem>
                  ))}
               </SidebarList>
            </Sidebar>
         </Wrapper>
      </Background>
   )
}
export default NewFeeds
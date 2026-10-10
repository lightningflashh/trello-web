import { useState, useEffect } from 'react'

import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
// Grid: https://mui.com/material-ui/react-grid2/#whats-changed
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import ListAltIcon from '@mui/icons-material/ListAlt'
import HomeIcon from '@mui/icons-material/Home'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import { Link, useLocation } from 'react-router-dom'
import SidebarCreateBoardModal from '~/pages/Boards/create'

import { fetchBoardsAPI, updateBoardDetailsAPI } from '~/apis'
import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '~/utils/constants'

import { styled } from '@mui/material/styles'
import { Api } from '@mui/icons-material'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300]
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff'
  }
}))

function Boards() {
  const [boards, setBoards] = useState(null)

  const [totalBoards, setTotalBoards] = useState(null)

  // Xử lý phân trang từ url với MUI: https://mui.com/material-ui/react-pagination/#router-integration
  const location = useLocation()

  /**
   * Parse chuỗi string search trong location về đối tượng URLSearchParams trong JavaScript
   * https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams
   */
  const query = new URLSearchParams(location.search)
  /**
   * Lấy giá trị page từ query, default sẽ là 1 nếu không tồn tại page từ url.
   * Nhắc lại kiến thức cơ bản hàm parseInt cần tham số thứ 2 là Hệ thập phân (hệ đếm cơ số 10) để đảm bảo chuẩn số cho phân trang
   */
  const page = parseInt(query.get('page') || '1', 10)

  const updateStateData = (data) => {
    setBoards(data.boards || [])
    setTotalBoards(data.totalBoards || 0)
  }

  useEffect(() => {
    // Mỗi khi cái url thay đổi ví dụ như ta chuyển trang, thì cái location.search lấy từ hook
    // useLocation của react-router-dom cũng thay đổi theo, đồng nghĩa hàm useEffect sẽ chạy lại
    // và fetch lại API theo đúng page mới vì cái location.search đã nằm trong dependencies của useEffect

    // Gọi API lấy danh sách boards ở đây...
    const fetchBoards = async () => {
      try {
        const data = await fetchBoardsAPI(location.search)
        updateStateData(data)
      } catch (error) {
        throw new Api(`Error fetching boards: ${error.message}`)
      }
    }

    fetchBoards()
  }, [location.search])

  const afterCreateNewBoard = async () => {
    try {
      const data = await fetchBoardsAPI(location.search)
      updateStateData(data)
    } catch (error) {
      throw new Api(`Error fetching boards after creating a new board: ${error.message}`)
    }
  }

  const handleUpdateBoardTitle = async (newTitle, board) => {
    await updateBoardDetailsAPI(board._id, { title: newTitle })
  }

  const handleUpdateBoardDescription = async (newDescription, board) => {
    await updateBoardDetailsAPI(board._id, { description: newDescription })
  }

  // Lúc chưa tồn tại boards > đang chờ gọi api thì hiện loading
  if (!boards) {
    return <PageLoadingSpinner caption="Loading Boards..." />
  }

return (
    <Container disableGutters maxWidth={false} sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* 1. AppBar cố định đỉnh trang, không bao giờ bị đè khi scroll */}
      <Box 
        sx={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 1100, 
          bgcolor: 'background.paper',
          boxShadow: (theme) => 
            theme.palette.mode === 'dark' 
              ? '0 2px 8px rgba(0,0,0,0.5)' 
              : '0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        <AppBar />
      </Box>

      {/* 2. Khoảng cách nội dung chuẩn */}
      <Box sx={{ paddingX: { xs: 2, md: 5 }, py: 3 }}>
        <Grid container spacing={4}>
          {/* Sidebar */}
          <Grid xs={12} md={3}>
            <Stack direction="column" spacing={1}>
              <SidebarItem className="active">
                <SpaceDashboardIcon fontSize="small" />
                Boards
              </SidebarItem>
              <SidebarItem>
                <ListAltIcon fontSize="small" />
                Templates
              </SidebarItem>
              <SidebarItem>
                <HomeIcon fontSize="small" />
                Home
              </SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack direction="column" spacing={1}>
              <SidebarCreateBoardModal afterCreateNewBoard={afterCreateNewBoard} />
            </Stack>
          </Grid>

          {/* Content */}
          <Grid xs={12} md={9}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
              Your boards:
            </Typography>

            {/* Trạng thái không tìm thấy Board */}
            {boards?.length === 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 8,
                  px: 2,
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)')
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  No result found!
                </Typography>
              </Box>
            )}

            {/* Danh sách Board */}
            {boards?.length > 0 && (
              <Grid container spacing={2.5}>
                {boards.map((b) => (
                  <Grid xs={12} sm={6} md={4} key={b._id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        boxShadow: (theme) =>
                          theme.palette.mode === 'dark'
                            ? '0 4px 12px rgba(0,0,0,0.4)'
                            : '0 4px 12px rgba(0,0,0,0.05)',
                        transition: 'all 0.25s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: (theme) =>
                            theme.palette.mode === 'dark'
                              ? '0 8px 24px rgba(0,0,0,0.6)'
                              : '0 8px 24px rgba(0,0,0,0.12)'
                        }
                      }}
                    >
                      {/* Banner Cover Image */}
                      <Box sx={{ position: 'relative', height: 110, overflow: 'hidden' }}>
                        <CardMedia
                          component="img"
                          height="110"
                          image="https://picsum.photos/300/120"
                          alt={b?.title}
                          sx={{ filter: 'brightness(0.9)' }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.4) 100%)'
                          }}
                        />
                      </Box>

                      {/* Card Content */}
                      <CardContent
                        sx={{
                          p: 2,
                          flexGrow: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          '&:last-child': { pb: 2 }
                        }}
                      >
                        <Box>
                          {/* Title */}
                          <Typography
                            variant="subtitle1"
                            component="div"
                            sx={{ fontWeight: 600, mb: 0.5, lineHeight: 1.3 }}
                          >
                            <ToggleFocusInput
                              value={b?.title}
                              onChangedValue={(onUpdateBoardTitle) =>
                                handleUpdateBoardTitle(onUpdateBoardTitle, b)
                              }
                              data-no-dnd="true"
                            />
                          </Typography>

                          {/* Description nhỏ gọn, chữ màu dịu */}
                          <Typography
                            component="div"
                            sx={{
                              fontSize: '0.75rem !important',
                              color: 'text.secondary',
                              lineHeight: 1.4,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              minHeight: 34,
                              mt: 0.5,
                              '& *, & input, & textarea, & p, & span, & div': {
                                fontSize: '0.75rem !important',
                                color: (theme) =>
                                  theme.palette.mode === 'dark' ? '#b0bec5 !important' : '#5e6c84 !important',
                                fontWeight: 'normal !important'
                              }
                            }}
                          >
                            <ToggleFocusInput
                              value={b?.description || 'No description...'}
                              onChangedValue={(onUpdateBoardDescription) =>
                                handleUpdateBoardDescription(onUpdateBoardDescription, b)
                              }
                              data-no-dnd="true"
                            />
                          </Typography>
                        </Box>

                        {/* Link sang Board */}
                        <Box
                          component={Link}
                          to={`/boards/${b._id}`}
                          sx={{
                            mt: 2,
                            pt: 1,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            textDecoration: 'none',
                            color: 'primary.main',
                            transition: 'color 0.2s ease',
                            '&:hover': {
                              color: 'primary.dark',
                              '& .MuiSvgIcon-root': {
                                transform: 'translateX(3px)'
                              }
                            }
                          }}
                        >
                          Go to board 
                          <ArrowRightIcon fontSize="small" sx={{ transition: 'transform 0.2s ease', ml: 0.3 }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Phân trang */}
            {totalBoards > 0 && (
              <Box sx={{ my: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Pagination
                  size="medium"
                  showFirstButton
                  showLastButton
                  count={Math.ceil(totalBoards / DEFAULT_ITEMS_PER_PAGE)}
                  page={page}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 1.5,
                      fontWeight: 500,
                      color: (theme) => (theme.palette.mode === 'dark' ? '#eceff1' : '#2c3e50')
                    },
                    '& .MuiPaginationItem-root.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: '#ffffff',
                      fontWeight: 700,
                      '&:hover': {
                        bgcolor: 'primary.dark'
                      }
                    }
                  }}
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      to={`/boards${item.page === DEFAULT_PAGE ? '' : `?page=${item.page}`}`}
                      {...item}
                    />
                  )}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Boards

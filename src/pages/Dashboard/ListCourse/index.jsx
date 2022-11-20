import { useState, useEffect } from 'react'
import {
    Box,
    Card,
    Button,
    CardMedia,
    Stack,
    Typography,
    Paper,
    Divider
} from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SendIcon from '@mui/icons-material/Send';
import Page from 'components/Page'
import apiCourse from 'apis/apiCourse';
import { Link } from 'react-router-dom';
import AppWidgetSummary from 'components/AppWidgetSummary';
const ListCourse = () => {
    const [courses, setCourses] = useState([])
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(5)
    const limit = 10

    useEffect(() => {
        const getData = () => {
            const params = {
                page,
                limit
            }
            apiCourse.getListCourseByTeacher(params)
                .then(res => {
                    setCourses(res)
                    setTotalPage(Math.round(res.pagination.totalRows / limit))
                })
        }
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Page title='Danh sách khoá học'>

            <Stack spacing={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Số lượng khoá học" total={714000} icon={'ant-design:android-filled'} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Số lượng bài thi" total={9.2} color="info" icon={'ant-design:apple-filled'} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Số lượng bài tập" total={1723315} color="warning" icon={'ant-design:windows-filled'} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Số lượt thi" total={234} color="error" icon={'ant-design:bug-filled'} />
                    </Grid>
                </Grid>
                <Paper elevation={24}>
                    <Stack direction='row' justifyContent={'flex-end'} p={1.5}>
                        <Link to='/my/list-course/create-course'>
                            <Button variant='outlined'>Tạo khoá học</Button>
                        </Link>
                    </Stack>
                    <Divider></Divider>
                    <Grid container spacing={2} p={1.5}>
                        {
                            courses.map(item =>
                                <Grid key={item.id} lg={3} md={3} xs={6}>
                                    <Card className='hover-element' sx={{ maxWidth: 345, border: "1px solid #00e67660" }}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            width="180"
                                            image={item.image}
                                            alt="green iguana"
                                        />
                                        <Typography color="primary" variant="h5" component="div"
                                            sx={{
                                                textAlign: "center"
                                            }}>
                                            {item.name}
                                        </Typography>
                                        <Stack
                                            p='0.5rem 1rem'
                                            direction='row'
                                            justifyContent="center"
                                            spacing={2}>
                                            <Link to={`/course/${item.courseId}`}>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    endIcon={<AssignmentIcon />}
                                                >Chi tiết</Button>
                                            </Link>
                                            <Button variant="outlined" size="small"
                                                endIcon={<SendIcon />}>Chia sẻ</Button>
                                        </Stack>
                                    </Card>
                                </Grid>)
                        }
                    </Grid>
                </Paper>
            </Stack>
        </Page>
    )
}

export default ListCourse
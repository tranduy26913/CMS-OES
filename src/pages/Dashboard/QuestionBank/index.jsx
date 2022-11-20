import {
    Paper,
    Card,
    CardContent,
    Button,
    Typography,
    Stack,
    Divider
} from '@mui/material'

import React, { useCallback, useState } from 'react'
import { useEffect } from 'react';
import apiQuestionBank from 'apis/apiQuestionBank';
import Grid from '@mui/material/Unstable_Grid2';
import CreateQuestionBank from './CreateQuestionBank';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const QuestionBank = () => {
    const [questionBanks, setQuestionBanks] = useState(samples)

    useEffect(() => {
        const loadList = () => {
            reloadList()
        }
        loadList()
    }, [])
    const reloadList = useCallback(() => {
        apiQuestionBank.getQuestionBanks()
            .then(res => {
                setQuestionBanks(res)
            })
    }, [])

    const handleDeleteQB = (slug) => {
        apiQuestionBank.deleteQuestionBank({ slug })
            .then(res => {
                toast.success("Xoá thành công")
                reloadList()
            })
    }
    return (
        <Paper>
            <Stack spacing={1} p={2}>
                <Stack direction='row' justifyContent='flex-end' mb={1}>
                    <CreateQuestionBank  variant='outlined' reloadList={reloadList} />
                </Stack>
                <Divider />
                <Grid container spacing={2}>
                    {questionBanks.map(item =>
                        <Grid xs={12} md={4} lg={3}>
                            <Card sx={{ maxWidth: 345 }}>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {item.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.description}
                                    </Typography>
                                </CardContent>
                                <Divider />
                                <Stack direction='row' flexWrap='wrap' justifyContent='space-evenly' gap={1} py={1}>
                                    <Link to={`/my/question-bank/${item.slug}`}>
                                        <Button variant='outlined' sx={{ width: '70px' }} size="small">Chi tiết</Button>
                                    </Link>
                                    <CreateQuestionBank slug={item.slug} edit={true} reloadList={reloadList} 
                                     variant='outlined' sx={{ width: '70px' }} size="small">Sửa</CreateQuestionBank>
                                    <Button variant='outlined' sx={{ width: '70px' }} size="small">Xoá</Button>
                                </Stack>
                            </Card>
                        </Grid>
                    )
                    }
                </Grid>
            </Stack>
        </Paper>

    )
}


const samples = [
    {
        id: 1,
        name: "Môn toán",
        description: "Ngân hàng các câu hỏi môn toán từ dễ đến khó",
        slug: 1,
    },
    {
        id: 2,
        name: "Môn Lý",
        description: "Ngân hàng các câu hỏi môn Lý từ dễ đến khó",
        slug: 1,
    },
    {
        id: 3,
        name: "Môn Hoá",
        description: "Ngân hàng các câu hỏi môn Hoá từ dễ đến khó",
        slug: 1,
    },
    {
        id: 4,
        name: "Môn Văn",
        description: "Ngân hàng các câu hỏi môn Văn từ dễ đến khó",
        slug: 1,
    },
]

export default QuestionBank

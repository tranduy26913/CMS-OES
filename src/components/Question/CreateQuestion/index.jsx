import {
  Stack,
  Button,
  TextField,
  FormControlLabel,
  Typography,
  RadioGroup,
  Radio,
  FormLabel,
  FormControl
} from '@mui/material'
import React, { useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CheckIcon from '@mui/icons-material/Check';
import { useTheme } from '@mui/system';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useCallback } from 'react';
import apiQuestion from 'apis/apiQuestion';
import { useDispatch } from 'react-redux';
import { addQuestion, updateQuestion } from 'slices/userSlice';
import LoadingButton from 'components/LoadingButton';
import { toast } from 'react-toastify';
import apiQuestionBank from 'apis/apiQuestionBank';

const alpha = Array.from(Array(26)).map((e, i) => i + 65);
const alphabet = alpha.map((x) => String.fromCharCode(x));

const BoxCheck = ({ isCheck, onClick }) => {
  const theme = useTheme()
  return (
    <Stack onClick={onClick}
      justifyContent={'center'} alignItems='center'
      sx={{
        cursor: 'pointer',
        height: '30px',
        width: '30px',
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: '4px',
        backgroundColor: isCheck ? theme.palette.primary.main : '#fff'
      }}>
      <CheckIcon
        sx={{
          color: isCheck ? '#fff' : theme.palette.primary.main,
          fontSize: '18px'
        }} />
    </Stack>
  )
}
const BoxDelete = ({ onClick }) => {
  const theme = useTheme()
  return (
    <Stack onClick={onClick}
      justifyContent={'center'} alignItems='center'
      sx={{
        cursor: 'pointer',
        height: '30px',
        width: '30px',
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: '4px',
      }}>
      <DeleteOutlineIcon
        sx={{
          color: theme.palette.primary.main,
          fontSize: '18px'
        }} />
    </Stack>
  )
}

const CreateQuestion = (props) => {
  const { isEdit, examId, questionBankId, question, id } = props
  const [content, setContent] = useState(question ? question.content : '')
  const [answers, setAnswers] = useState(question ? question.answers : [])
  const [maxPoints, setMaxPoints] = useState()
  const [loading, setLoading] = useState(false)
  const [typeAnswer, setTypeAnswer] = useState('single')//single:1 ????p ??n ????ng, multi: nhi???u ????p ??n ????ng
  const dispatch = useDispatch()

  const handleChangeMaxPoints = (e) => {
    setMaxPoints(e.target.value)
  }

  const handleChangeTypeAnswer = (e) => {
    setTypeAnswer(e.target.value)
    if (e.target.value === 'single') {
      let newAnswers = [...answers]
      newAnswers = newAnswers.map(item => {
        const newAnswer = item
        newAnswer.isCorrect = false
        return newAnswer
      })
      setAnswers(newAnswers)
    }
  }
  const handleAddAnswer = () => {
    let len = (answers.length || 0) + 1
    const newAnswer = {
      id: len,
      content: '',
      isCorrect: false,
    }
    setAnswers(pre => [...pre, newAnswer])
  }

  const handleDeleteAnswer = useCallback((idAnswer) => {
    let newAnswers = [...answers]
    newAnswers = newAnswers.filter(item => item.id !== idAnswer)
    setAnswers(newAnswers)
  }, [answers])

  const handleChangeInputAnswer = (e, idAnswer) => {
    const newAnswers = [...answers]
    const answerIndex = answers.findIndex(item => item.id === idAnswer)
    if (answerIndex > -1) {
      newAnswers[answerIndex] = {
        ...answers[answerIndex],
        content: e.target.value
      }

      setAnswers(newAnswers)
    }
  }

  const handleChooseCorrect = useCallback((idAnswer) => {
    let newAnswers = [...answers]
    const answerIndex = answers.findIndex(item => item.id === idAnswer)
    if (answerIndex > -1) {
      if (typeAnswer === 'single') {
        newAnswers = newAnswers.map(item => {
          const newAnswer = item
          if (newAnswer.id === idAnswer)
            newAnswer.isCorrect = !newAnswer.isCorrect
          else
            newAnswer.isCorrect = false
          return newAnswer
        })
      }
      else
        newAnswers[answerIndex].isCorrect = !newAnswers[answerIndex].isCorrect
    }
    setAnswers(newAnswers)
  }, [answers, typeAnswer])

  const handleCreateQuestion = async () => {
    const params = {
      content,
      maxPoints,
      type: typeAnswer,
      image: "",
      answers,
      examId
    }
    let response = null
    if (examId) {
      params.examId = examId
      response = apiQuestion.createQuestion(params)
    }
    else {
      params.questionBankId = questionBankId
      response = apiQuestionBank.createQuestionIntoQuestionBank(params)
    }
    setLoading(true)
    response.then((res) => {
      let newQuestion = res.question
      dispatch(addQuestion(newQuestion))
      handleClearData()
      toast.success('T???o c??u h???i m???i th??nh c??ng')
    })
      .catch(err => {
        toast.warning('T???o c??u h???i m???i th???t b???i')
      })
      .finally(() => setLoading(false))

  }

  const handleEditQuestion = () => {
    const params = {
      content,
      maxPoint: 1,
      tag: [],
      type: typeAnswer,
      embededMedia: "",
      answers
    }
    setLoading(true)
    apiQuestion.updateQuestion(params, id)
      .then((res) => {

        dispatch(updateQuestion(res))
      })
      .finally(() => {
        setLoading(false)
        props.handleSelectQuestion("")
      })
  }

  const handleClearData = () => {
    setContent('')
    setAnswers([])
    setMaxPoints(1)
    setTypeAnswer('single')
  }
  return (

    <Stack spacing={1.5} mb={2} p={2}>
      <Typography fontWeight={600} mb={1}>Nh???p n???i dung c??u h???i</Typography>
      <CKEditor
        editor={ClassicEditor}
        data={content}
        onReady={editor => {
          // You can store the "editor" and use when it is needed.
          console.log('Editor is ready to use!', editor);
        }}
        onChange={(event, editor) => {
          setContent(editor.getData());
        }}
        onBlur={(event, editor) => {
        }}
        onFocus={(event, editor) => {
        }}
      />
      <TextField
        label='??i???m t???i ??a'
        value={maxPoints}
        variant='standard'
        onChange={handleChangeMaxPoints}
      />
      <FormControl>
        <FormLabel>S??? ????p ??n ????ng</FormLabel>
        <RadioGroup
          row
          name="controlled-radio-buttons-group"
          value={typeAnswer}
          onChange={handleChangeTypeAnswer}
        >
          <FormControlLabel value="single" control={<Radio />} label="M???t ????p ??n ????ng" />
          <FormControlLabel value="multi" control={<Radio />} label="Nhi???u ????p ??n ????ng" />
        </RadioGroup>
      </FormControl>
      {

        answers.map((item, index) =>
          <Stack direction={'row'} width={'100%'} alignItems='flex-end' spacing={2}>

            <TextField variant='standard' size='small' fullWidth
              label={`????p ??n ${alphabet[index]}`} value={item.content}
              onChange={e => handleChangeInputAnswer(e, item.id)} />
            <BoxCheck isCheck={item.isCorrect} onClick={() => handleChooseCorrect(item.id)} />
            <BoxDelete onClick={() => handleDeleteAnswer(item.id)} />
          </Stack>)
      }

      <Stack direction='row' justifyContent='center' >
        <Button onClick={handleAddAnswer} variant='outlined'>Th??m ????p ??n</Button></Stack>
      <Stack direction={'row'} spacing={1.5} justifyContent='flex-end'>
        {/* <Button variant='contained' color='error'>Hu???</Button> */}
        <Button onClick={handleClearData} variant='contained' color='warning'>L??m m???i</Button>
        <LoadingButton loading={loading} variant='contained'
          onClick={isEdit ? handleEditQuestion : handleCreateQuestion}>{isEdit ? 'S???a' : 'T???o'} c??u h???i</LoadingButton>
      </Stack>
    </Stack>

  )
}

export default CreateQuestion
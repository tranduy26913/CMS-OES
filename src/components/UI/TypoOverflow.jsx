import React from 'react'
import {  Typography }
    from '@mui/material'
function TypoOverflow({line,children}) {
    return (
        <Typography className={`text-overflow-${line}-lines`}
        >
            {children}
        </Typography>
    )
}

export default TypoOverflow
import React from 'react'

interface PrintDataInterface{
    date:string;
}

const getDay = (date:string):string =>{
    const day = date.match(/(.+)T/)
    if(day){
        return day[1]
    }
    return 'problem in getDay'
}

const getHours = (date:string):string =>{
    const day = date.match(/T(\d{2}:\d{2})/)
    if(day){
        return day[1]
    }
    return 'problem in getHours'
}

export const PrintDate = (props:PrintDataInterface) => {
    const {date}=props
    console.log('date : ',date)
  return (
    <div className="PrintDate">
        <p className="day">{getDay(date)}</p>
        <p className="hours">{getHours(date)}</p>
    </div>
  )
}

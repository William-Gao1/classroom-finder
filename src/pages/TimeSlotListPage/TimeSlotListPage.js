import { useState, useEffect } from 'react'

import { getFreeTimeSlots } from '../../services/timeSlots'
import { formatTimeRange } from '../../services/time'

export default function ClassroomListPage() {
  const [timeSlots, setTimeSlots] = useState([])
  //const [buildings, setBuildings] = useState({})
  useEffect(() => {
    const fetchDataFromPortal = async () => {
      const data = await getFreeTimeSlots()
      setTimeSlots(data.timeSlots)
      //setBuildings(data.buildings)
    }

    fetchDataFromPortal()
  }, [])

  const currentTime = Date.now();

  return (
    <ul>
      {timeSlots.filter(({ startTime, endTime }) => startTime <= currentTime && endTime > currentTime).map((slot) => (
        <li>
          {slot.buildingCode} {slot.roomNumber} {formatTimeRange(slot.startTime, slot.endTime)}
        </li>
      ))}
    </ul>
  )
}
import axios from "axios";

import { createDateFromWeekdayAndTime } from "./time";

const getBuildingSchedule = (openClassroomSlots) => {
  // openClassroomSlots from portal returns an array of Rooms, each Room has a Schedule
  // which is a list of Weekdays. Each Weekday has a list of times when the room is open

  // we do not care about which room we study in, so let's convert this complicated structure into a list
  // of free time slots and their associated room
  const freeTimes = []

  // iterate over each room
  openClassroomSlots.forEach((room) => {
    // extract room metadata
    const roomNumber = parseInt(room.roomNumber)
    const buildingCode = room.buildingCode

    // iterate over each schedule
    room.Schedule.forEach((schedule) => {
      // extract schedule metadata
      const weekday = schedule.Weekday

      // iterate over each time slot
      schedule.Slots.forEach((slot) => {
        // construct the final object and append it to our list
        freeTimes.push({
          startTime: createDateFromWeekdayAndTime(weekday, slot.StartTime),
          endTime: createDateFromWeekdayAndTime(weekday, slot.EndTime),
          roomNumber: roomNumber,
          buildingCode: buildingCode,
          id: `${buildingCode}-${roomNumber}-${weekday}-${slot.StartTime}-${slot.EndTime}`
        })
      })
    })
  })

  return freeTimes.sort((a, b) => a.buildingCode.localeCompare(b.buildingCode) || a.roomNumber - b.roomNumber)
}

export const getFreeTimeSlots = async () => {
  // make an api call to portal

  const portalClassroomApiUrl = process.env.NODE_ENV === "development" ? `${process.env.REACT_APP_PORTAL_API_PREFIX}/map/OpenClassrooms` : process.env.REACT_APP_PORTAL_API_PREFIX
  const res = await axios.get(portalClassroomApiUrl)

  // extract building info from response
  const data = res.data.data.features

  // each building consists of a list of classrooms
  // portal data is weird, let's convert each portal classroom object
  // to something more reasonable

  // first maintain a map of buildings
  const buildings = {}

  const timeSlots = []
  data.forEach((portalClassroom) => {

    buildings[portalClassroom.properties.buildingCode] = ({
      coordinates: portalClassroom.geometry.coordinates, // maybe use this for cool geolocation stuff later
      buildingId: portalClassroom.properties.buildingId, // id probably not useful to us but always good to have
      buildingName: portalClassroom.properties.buildingName,
    })


    // portal returns this as a string so we need to convert it to json before extracting 
    // schedule using the getBuildingSchedule function defined above
    timeSlots.push(...getBuildingSchedule(JSON.parse(portalClassroom.properties.openClassroomSlots).data))
  })

  return { timeSlots, buildings }
}
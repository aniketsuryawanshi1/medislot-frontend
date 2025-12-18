import { useDispatch, useSelector } from "react-redux";
import {
  getDoctorProfiles,
  createDoctorProfile,
  getDoctorProfileById,
  updateDoctorProfile,
  deleteDoctorProfile,
  getDoctorSchedules,
  createDoctorSchedule,
  getDoctorScheduleById,
  updateDoctorSchedule,
  deleteDoctorSchedule,
  getAvailableSlots,
  getDoctorAppointments,
  getDoctorAppointmentById,
  confirmAppointment,
} from "../api/doctor/doctorThunks";

const useDoctor = () => {
  const dispatch = useDispatch();
  const doctorState = useSelector((state) => state.doctor);

  return {
    // State
    profiles: doctorState.profiles,
    schedules: doctorState.schedules,
    availableSlots: doctorState.availableSlots,
    appointments: doctorState.appointments,
    loading: doctorState.loading,
    error: doctorState.error,

    // Actions
    fetchProfiles: () => dispatch(getDoctorProfiles()),
    createProfile: (data) => dispatch(createDoctorProfile(data)),
    fetchProfileById: (uuid) => dispatch(getDoctorProfileById(uuid)),
    updateProfile: (uuid, data) =>
      dispatch(updateDoctorProfile({ uuid, data })),
    deleteProfile: (uuid) => dispatch(deleteDoctorProfile(uuid)),

    fetchSchedules: () => dispatch(getDoctorSchedules()),
    createSchedule: (data) => dispatch(createDoctorSchedule(data)),
    fetchScheduleById: (uuid) => dispatch(getDoctorScheduleById(uuid)),
    updateSchedule: (uuid, data) =>
      dispatch(updateDoctorSchedule({ uuid, data })),
    deleteSchedule: (uuid) => dispatch(deleteDoctorSchedule(uuid)),

    fetchAvailableSlots: (params) => dispatch(getAvailableSlots(params)),

    fetchAppointments: () => dispatch(getDoctorAppointments()),
    fetchAppointmentById: (uuid) => dispatch(getDoctorAppointmentById(uuid)),
    confirmAppointment: (uuid) => dispatch(confirmAppointment(uuid)),

    clearError: () => dispatch({ type: "doctor/clearError" }),
  };
};

export default useDoctor;

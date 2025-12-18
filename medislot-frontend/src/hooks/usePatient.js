import { useDispatch, useSelector } from "react-redux";
import {
  getPatientProfiles,
  createPatientProfile,
  getPatientProfileById,
  updatePatientProfile,
  deletePatientProfile,
  getPatientAppointments,
  createPatientAppointment,
  getPatientAppointmentById,
  cancelAppointment,
  rescheduleAppointment,
  getWaitingList,
  joinWaitingList,
  getWaitingListEntryById,
  removeWaitingListEntry,
} from "../api/patient/patientThunks";

const usePatient = () => {
  const dispatch = useDispatch();
  const patientState = useSelector((state) => state.patient);

  return {
    // State
    profiles: patientState.profiles,
    appointments: patientState.appointments,
    waitingList: patientState.waitingList,
    loading: patientState.loading,
    error: patientState.error,

    // Actions
    fetchProfiles: () => dispatch(getPatientProfiles()),
    createProfile: (data) => dispatch(createPatientProfile(data)),
    fetchProfileById: (uuid) => dispatch(getPatientProfileById(uuid)),
    updateProfile: (uuid, data) =>
      dispatch(updatePatientProfile({ uuid, data })),
    deleteProfile: (uuid) => dispatch(deletePatientProfile(uuid)),

    fetchAppointments: () => dispatch(getPatientAppointments()),
    createAppointment: (data) => dispatch(createPatientAppointment(data)),
    fetchAppointmentById: (uuid) => dispatch(getPatientAppointmentById(uuid)),
    cancelAppointment: (uuid) => dispatch(cancelAppointment(uuid)),
    rescheduleAppointment: (uuid, data) =>
      dispatch(rescheduleAppointment({ uuid, data })),

    fetchWaitingList: () => dispatch(getWaitingList()),
    joinWaitingList: (data) => dispatch(joinWaitingList(data)),
    fetchWaitingListEntryById: (uuid) =>
      dispatch(getWaitingListEntryById(uuid)),
    removeWaitingListEntry: (uuid) => dispatch(removeWaitingListEntry(uuid)),

    clearError: () => dispatch({ type: "patient/clearError" }),
  };
};

export default usePatient;

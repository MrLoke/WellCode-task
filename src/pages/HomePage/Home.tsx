import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import {
  AppointmentModel,
  EditingState,
  ViewState,
  ChangeSet,
} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  Appointments,
  AppointmentTooltip,
  WeekView,
  MonthView,
  Toolbar,
  ViewSwitcher,
  DateNavigator,
  TodayButton,
  AllDayPanel,
  EditRecurrenceMenu,
  ConfirmationDialog,
  AppointmentForm,
} from '@devexpress/dx-react-scheduler-material-ui';
import {
  firestore,
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from 'src/services/firebaseConfig';
import { Timestamp } from 'firebase/firestore';

type FirestoreEventData = {
  id: string;
  title?: string;
  notes?: string;
  startDate: Timestamp;
  endDate: Timestamp;
  allDay?: boolean;
};

export const Home = () => {
  const [data, setData] = useState<AppointmentModel[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date(Date.now()));
  const [startDayHour, setStartDayHour] = useState<number>(9);
  const [endDayHour, setEndDayHour] = useState<number>(14);
  console.log('data', data);

  const convertFirestoreDataToScheduler = (
    data: FirestoreEventData
  ): AppointmentModel => {
    return {
      id: data.id,
      title: data.title || 'Bez tytułu',
      notes: data.notes || '',
      startDate: new Date(data.startDate.seconds * 1000),
      endDate: new Date(data.endDate.seconds * 1000),
      allDay: data.allDay || false,
    };
  };

  useEffect(() => {
    const eventsCollection = collection(firestore, 'events');
    const unsubscribe = onSnapshot(eventsCollection, (snapshot) => {
      const events: AppointmentModel[] = snapshot.docs.map((doc) => {
        const data = doc.data();

        const startHour = data.startDayHour || 9;
        const endHour = data.endDayHour || 14;

        setStartDayHour(startHour);
        setEndDayHour(endHour);

        return convertFirestoreDataToScheduler({
          id: doc.id,
          ...data,
          startDate: new Timestamp(
            data.startDate.seconds,
            data.startDate.nanoseconds
          ),
          endDate: new Timestamp(
            data.endDate.seconds,
            data.endDate.nanoseconds
          ),
        });
      });
      console.log('events', events);
      setData(events);
    });

    return () => unsubscribe();
  }, []);

  const commitChanges = ({ added, changed, deleted }: ChangeSet): void => {
    if (added) {
      const newAppointment: AppointmentModel = {
        ...added,
        startDate: new Date(added.startDate),
        endDate: new Date(added.endDate),
      };

      addDoc(collection(firestore, 'events'), newAppointment)
        .then((docRef) => console.log('Document written with ID: ', docRef.id))
        .catch((error) => console.error('Error adding document: ', error));
    }

    if (changed) {
      Object.keys(changed).forEach((id) => {
        const eventRef = doc(firestore, 'events', id.toString());
        updateDoc(eventRef, changed[id])
          .then(() => console.log('Document successfully updated!'))
          .catch((error) => console.error('Error updating document: ', error));
      });
    }

    if (deleted !== undefined) {
      const eventRef = doc(firestore, 'events', deleted.toString());
      deleteDoc(eventRef)
        .then(() => console.log('Document successfully deleted!'))
        .catch((error) => console.error('Error deleting document: ', error));
    }
  };

  const currentDateChange = (currentDate: Date) => {
    setCurrentDate(currentDate);
  };

  return (
    <Paper>
      <Scheduler data={data ? data : []} locale={'pl-PL'}>
        <ViewState
          defaultCurrentDate={Date.now()}
          currentDate={currentDate}
          // currentDate={Date.now()}
          onCurrentDateChange={currentDateChange}
        />
        <EditingState onCommitChanges={commitChanges} />

        <DayView startDayHour={startDayHour} endDayHour={endDayHour} />
        <WeekView startDayHour={startDayHour} endDayHour={endDayHour} />
        <MonthView />
        <AllDayPanel />
        <EditRecurrenceMenu />
        <ConfirmationDialog />
        <Toolbar />
        <DateNavigator />
        <TodayButton />
        <ViewSwitcher />
        <Appointments />
        <AppointmentTooltip showOpenButton showDeleteButton />
        <AppointmentForm />
      </Scheduler>
    </Paper>
  );
};

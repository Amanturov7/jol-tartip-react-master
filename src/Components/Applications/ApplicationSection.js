// ApplicationSection.jsx
import ApplicationForm from './Component/ApplicationForm';
import ApplicationsList from './Component/ApplciationsList';

const ApplicationSection = () => {

  return (
    <div className='container'>
            <h2>Список заявлений</h2>

      <ApplicationForm />

      <ApplicationsList />
    </div>
  );
};

export default ApplicationSection;

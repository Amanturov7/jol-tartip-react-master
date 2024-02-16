// ApplicationSection.jsx
import ApplicationForm from './Component/ApplicationForm';
import ApplicationsList from './Component/ApplciationsList';

const ApplicationSection = () => {
  const isUserAuthenticated = sessionStorage.getItem("token") !== null;
  if (!isUserAuthenticated) {
    return (
      <div className='container'>
              <h2>Реестр нарушений</h2>
        <ApplicationsList />
      </div>
    );
  }
  return (
    <div className='container'>
            <h2>Реестр нарушений</h2>

      <ApplicationForm />
      <ApplicationsList />
    </div>
  );
};

export default ApplicationSection;

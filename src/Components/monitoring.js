import React from 'react';

const Monitoring = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        src="http://localhost:5601/app/dashboards#/view/3c75e1e0-ec63-11ee-b66f-ebbd791d8078?embed=true&_g=(filters%3A!()%2CrefreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3A'2022-12-31T18%3A06%3A40.774Z'%2Cto%3A'2023-10-13T18%3A07%3A14.543Z'))&show-time-filter=true&hide-filter-bar=true"
        height="100%"
        width="100%"
        style={{ border: 'none' }}
      ></iframe>
    </div>
  );
};

export default Monitoring;

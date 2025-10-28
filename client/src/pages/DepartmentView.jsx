import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Loader, Placeholder } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import ReactModal from 'react-modal';
ReactModal.setAppElement('#root');
import axios from 'axios';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';
import LogoHeader from '../components/LogoHeader';
//import '../assets/style.css';

import '../assets/Departmentstyle.css';

const DepartmentView = () => {
  const { id } = useParams();
  const location = useLocation();
  const departmentNameFromState = location.state?.name;
  const [department, setDepartment] = useState(null);

  const [regulations, setRegulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState('');

  useEffect(() => {
    const fetchDept = async () => {
      try {
        const res = await axios.get(`https://siet-qb-5qpb.vercel.app/api/departments/${id}`);
        
        setDepartment(res.data.department || res.data);
        setRegulations(res.data.regulations || res.data.regulations);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching department:', err);
        setLoading(false);
      }
    };

    fetchDept();
  }, [id]);

  return (
    <div className="page-containerDP">
      <LogoHeader />
      <Navbar />
      <main>
        <h2 style={{ textAlign: 'center', marginBottom: "20px" }}>
          Department of {department?.name || departmentNameFromState || "Department"}
        </h2>
        {loading ? (
          <div className="page-containerDP">
            <div>
              <Placeholder.Paragraph rows={8} />
              <Loader center content="loading" />
            </div>
          </div>
        ) : (
          <>

            {regulations.map((reg) => (
              <div key={reg._id} className="regulation-sectionDP">
                <h2>Regulation: {reg.year}</h2>

                {reg.semesters.map((sem) => (
                  <div key={sem._id} className="semester-boxDP">
                    <h3>Semester {sem.number}</h3>

                    {sem.subjects.length === 0 ? (
                      <p>No subjects found.</p>
                    ) : (
                      <table className="subject-tableDP">
                        <colgroup>
                          <col style={{ width: "65%" }} />
                          <col style={{ width: "35%" }} />
                        </colgroup>
                        <thead>
                          <tr>
                            <th>Subject Name</th>
                            <th>Question Papers</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sem.subjects.map((sub) => (
                            <tr key={sub._id}>
                              <td>{sub.name}</td>
                              <td>
                                {sub.files.length === 0 ? (
                                  <span>No files uploaded.</span>
                                ) : (

                                  <ul className="file-list">
                                    {sub.files.map((file, i) => (
                                      <li key={i}>
                                        <a
                                          className="view-btn"
                                          onClick={() => {
                                            setCurrentFileUrl(file.fileUrl);
                                            setModalOpen(true);
                                          }}
                                        >
                                          {/* href={file.fileUrl} target="_blank" rel="noreferrer"*/}{file.fileName} 
                                        </a>
                                      </li>
                                    ))}
                                  </ul>


                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </main>
      <ReactModal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="PDF Viewer"
        style={{
          
    overlay: {
      zIndex: 9999,
    },
          content: {
            width: '90%',
            height: '90%',
            margin: 'auto',
          }
        }}
      >
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(currentFileUrl)}&embedded=true`}
          width="99%"
          height="90%"
          frameBorder="0"
          onContextMenu={(e) => e.preventDefault()}
          title="View PDF"
        ></iframe>
        <button onClick={() => setModalOpen(false)} style={{ marginTop: '10px' }}>Close</button>
      </ReactModal>

      <Footer />
    </div>
  );
};

export default DepartmentView;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { IconButton, ButtonToolbar } from 'rsuite';
// import PlusIcon from '@rsuite/icons/Plus';
import '../assets/admin-panel.css';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaUpload, FaSignOutAlt } from 'react-icons/fa';
import LogoHeader from '../components/LogoHeader';
import Footer from '../components/Footer';
const AdminPanel = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [regulations, setRegulations] = useState([]);
  const [selectedReg, setSelectedReg] = useState(null);
  const [selectedSem, setSelectedSem] = useState(null);
  const [newDeptName, setNewDeptName] = useState('');
  const [newRegYear, setNewRegYear] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [editedSubjectName, setEditedSubjectName] = useState('');
  const [fileInput, setFileInput] = useState({});

  const token = localStorage.getItem('adminToken');
  const axiosAuth = axios.create({
    baseURL: 'http://localhost:5000/api/admin',
    headers: { Authorization: `Bearer ${token}` }
  });

  
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      console.log("Fetching departments...");
      const res = await axios.get('http://localhost:5000/api/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const handleAddDepartment = async () => {
    if (!newDeptName.trim()) return alert('Enter department name');
    try {
      console.log("Adding department...");
      const res = await axiosAuth.post('/department', { name: newDeptName });
      setDepartments([...departments, res.data]);
      setNewDeptName('');
    } catch (err) {
      console.error('Error adding department:', err);
    }
  };

  const handleSelectDept = async (deptId) => {
    const dept = departments.find(d => d._id === deptId);
    setSelectedDept(dept);
    setSelectedReg(null);
    setSelectedSem(null);
    try {
      console.log("Fetching regulations for department:", dept.name);
      const res = await axios.get(`http://localhost:5000/api/departments/${deptId}`);
      setRegulations(res.data.regulations);
    } catch (err) {
      console.error('Error fetching regulations:', err);
    }
  };

  const handleAddRegulation = async () => {
    if (!newRegYear.trim()) return alert('Enter regulation year');
    try {
      console.log("Adding regulation...");
      const res = await axiosAuth.post('/regulation', {
        departmentId: selectedDept._id,
        year: newRegYear
      });
      setRegulations([...regulations, res.data.regulation]);
      setNewRegYear('');
    } catch (err) {
      console.error('Error adding regulation:', err);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) return alert('Enter subject name');
    try {
      console.log("Adding subject...");
      const res = await axiosAuth.post('/subject', {
        semesterId: selectedSem._id,
        name: newSubjectName
      });
      const updatedSubjects = [...(selectedSem.subjects || []), res.data];
      setSelectedSem({ ...selectedSem, subjects: updatedSubjects });
      setNewSubjectName('');
    } catch (err) {
      console.error('Error adding subject:', err);
    }
  };

  const handleEditSubject = (subject) => {
    setEditingSubjectId(subject._id);
    setEditedSubjectName(subject.name);
  };

  const handleSaveSubject = async (subjectId) => {
    try {
      console.log("Saving subject changes...");
      const res = await axiosAuth.put(`/subject/${subjectId}`, { name: editedSubjectName });
      const updatedSubjects = selectedSem.subjects.map(sub => sub._id === subjectId ? res.data : sub);
      setSelectedSem({ ...selectedSem, subjects: updatedSubjects });
      setEditingSubjectId(null);
      setEditedSubjectName('');
    } catch (err) {
      console.error('Error saving subject:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingSubjectId(null);
    setEditedSubjectName('');
  };

  const handleFileUpload = async (subjectId) => {
    const file = fileInput[subjectId];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      console.log("Uploading file to subject:", subjectId);
      const res = await axiosAuth.post(`/upload/${subjectId}`, formData);
      const updatedSubjects = selectedSem.subjects.map(sub =>
        sub._id === subjectId ? res.data : sub
      );
      setSelectedSem({ ...selectedSem, subjects: updatedSubjects });
    } catch (err) {
      console.error('File upload failed:', err);
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    try {
      console.log("Deleting subject:", subjectId);
      await axiosAuth.delete(`/subject/${subjectId}`);
      const updatedSubjects = selectedSem.subjects.filter(sub => sub._id !== subjectId);
      setSelectedSem({ ...selectedSem, subjects: updatedSubjects });
    } catch (err) {
      console.error('Error deleting subject:', err);
    }
  };

  const handleDeleteFile = async (subjectId, fileUrl) => {
    try {
      console.log("Deleting file from subject:", subjectId);
      const res = await axiosAuth.delete(`/file/${subjectId}/${encodeURIComponent(fileUrl)}`);
      
      const updatedSubjects = selectedSem.subjects.map(sub => {
        if (sub._id === subjectId) {
          return {
            ...sub,
            files: sub.files.filter(f => f.fileUrl !== fileUrl)
          };
        }
        return sub;
      });
  
      setSelectedSem({ ...selectedSem, subjects: updatedSubjects });
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin-login';
  };

  return (
    <div className='page-cointainer'>
      <LogoHeader/>
    <div className="page-containerADMIN">
      <h1 className="admin-title">Admin Panel</h1>

      <table className="admin-table">
  <tbody>
    
    <tr>
      <td><strong>Choose Department:</strong></td>
      <td>
        <select onChange={(e) => handleSelectDept(e.target.value)} value={selectedDept?._id || ''}>
          <option value="">-- Select --</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>
      </td>
    </tr>
    <tr>
      <td><strong>Add New Department:</strong></td>
      <td>
        <input
          type="text"
          placeholder="Department Name"
          value={newDeptName}
          onChange={(e) => setNewDeptName(e.target.value)}
        /></td><td>
        <button type="button" onClick={handleAddDepartment}><FaPlus /></button>
      </td>
    </tr>

    
    {selectedDept && (
      <>
        <tr>
          <td><strong>Choose Regulation:</strong></td>
          <td>
            <select onChange={(e) => {
              const reg = regulations.find(r => r._id === e.target.value);
              setSelectedReg(reg);
              setSelectedSem(null);
            }} value={selectedReg?._id || ''}>
              <option value="">-- Select --</option>
              {regulations.map((r) => (
                <option key={r._id} value={r._id}>{r.year}</option>
              ))}
            </select>
          </td>
        </tr>
        <tr>
          <td><strong>Add New Regulation:</strong></td>
          <td>
            <input
              type="text"
              placeholder="Regulation Year"
              value={newRegYear}
              onChange={(e) => setNewRegYear(e.target.value)}
            /></td><td>
            <button type="button" onClick={handleAddRegulation}><FaPlus /></button>
          </td>
        </tr>
      </>
    )}

    
    {selectedReg && (
      <tr>
        <td><strong>Choose Semester:</strong></td>
        <td>
          <select
            value={selectedSem?._id || ''}
            onChange={(e) => {
              const sem = selectedReg.semesters?.find(s => s._id === e.target.value);
              setSelectedSem(sem);
            }}
          >
            <option value="">-- Select Semester --</option>
            {selectedReg.semesters?.map((s) => (
              <option key={s._id} value={s._id}>Semester {s.number}</option>
            ))}
          </select>
        </td>
      </tr>
    )}
  </tbody>
</table>

      
      {selectedSem && (
        <section>
          <h2 className="subjects-heading">AVAILABLE SUBJECTS OF SEMESTER {selectedSem.number}</h2>
          <table className="subjects-table">
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Files</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedSem.subjects?.map((sub) => (
                <tr key={sub._id}>
                  <td>
                    {editingSubjectId === sub._id ? (
                      <input
                        type="text"
                        value={editedSubjectName}
                        onChange={(e) => setEditedSubjectName(e.target.value)}
                      />
                    ) : (
                      sub.name
                    )}
                  </td>
                  <td>
                    {sub.files?.map((file, i) => (
                      <div key={file.fileUrl}>
                        <a href={file.fileUrl} target="_blank" rel="noreferrer">{file.fileName}</a>
                        <button type="button" onClick={() => handleDeleteFile(sub._id, file.fileUrl)}><FaTrash /></button>
                      </div>
                    ))}
                    <input
                      type="file"
                      onChange={(e) => setFileInput({ ...fileInput, [sub._id]: e.target.files[0] })}
                    />
                    <button type="button" onClick={() => handleFileUpload(sub._id)}><FaUpload /></button>
                  </td>
                  <td>
                    {editingSubjectId === sub._id ? (
                      <>
                        <button type="button" onClick={() => handleSaveSubject(sub._id)}><FaSave /></button>
                        <button type="button" onClick={handleCancelEdit}><FaTimes /></button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => handleEditSubject(sub)}><FaEdit /></button>
                        <button type="button" onClick={() => handleDeleteSubject(sub._id)}><FaTrash /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Add New Subject</h3>
          <table className="admin-table"><tbody>
            <tr><td>
          <input
            type="text"
            placeholder="Subject Name"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
          /></td><td>
          <button type="button" onClick={handleAddSubject}><FaPlus /></button>
          </td>
          </tr>
        </tbody>
        </table>
        </section>
        
      )}

      <div className="logout-container">
        <button type="button" className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
          
      <Footer/>
    
    </div>
    
  );
};

export default AdminPanel;
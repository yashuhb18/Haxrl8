import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { isOrganizerAuthorized } from './adminAuth';
import { Search, Download, FileText, LayoutDashboard, LogOut } from 'lucide-react';
import * as XLSX from 'xlsx';

const S = {
  bg: '#F8FAFC', card: '#FFFFFF', border: '#E5E7EB', primary: '#6C4EFF',
  t1: '#111827', t2: '#6B7280', t3: '#9CA3AF', activeBg: '#EEE8FF',
  radius: '14px', pad: '24px', gap: '20px',
};

export default function AdminJury() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const [loading, setLoading] = useState(true);
  
  const [submissions, setSubmissions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAll = async (table, orderCol) => {
    let allData = [];
    let from = 0;
    const step = 1000;
    while (true) {
      let query = supabase.from(table).select('*').range(from, from + step - 1);
      if (orderCol) query = query.order(orderCol, { ascending: false });
      const { data, error } = await query;
      if (error) break;
      if (data) allData = [...allData, ...data];
      if (!data || data.length < step) break;
      from += step;
    }
    return allData;
  };

  const fetchData = useCallback(async () => {
    // Fetch all submissions
    const subs = await fetchAll('submissions', 'created_at');
    
    // Fetch all teams
    const tms = await fetchAll('teams');
    
    // Fetch all team members
    const mbrs = await fetchAll('team_members');
    
    if (subs) setSubmissions(subs);
    if (tms) setTeams(tms);
    if (mbrs) setMembers(mbrs);
    
    setLoading(false);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const authorized = await isOrganizerAuthorized();
      if (authorized) {
        setIsAdmin(true);
        fetchData();
      } else {
        window.dispatchEvent(new Event('haxlr8_organizer_logout'));
      }
    };
    checkAuth();
  }, [fetchData]);

  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:S.bg}}><div style={{width:40,height:40,border:'3px solid '+S.primary,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/></div>;
  if (!isAdmin) {
    return (
      <div style={{minHeight:'60vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:12,padding:24}}>
        <div style={{fontSize:16,fontWeight:800,color:'#b91c1c'}}>Organizer Clearance Required</div>
        <button onClick={() => window.dispatchEvent(new Event('haxlr8_organizer_logout'))} style={{padding:'10px 18px',borderRadius:10,background:'#0284c7',color:'#fff',border:'none',fontWeight:800,cursor:'pointer'}}>
          Unlock Master Command Deck 🚀
        </button>
      </div>
    );
  }

  // Process data
  const processedData = submissions.map((sub, index) => {
    const team = teams.find(t => t.id === sub.team_id);
    const teamMembers = members.filter(m => m.team_id === sub.team_id);
    
    const tl = teamMembers.find(m => m.is_leader) || teamMembers[0] || null;
    const otherMembers = teamMembers.filter(m => m.id !== tl?.id);
    
    const tm1 = otherMembers[0] || null;
    const tm2 = otherMembers[1] || null;
    const tm3 = otherMembers[2] || null;

    return {
      sNo: index + 1,
      teamName: team?.team_name || 'N/A',
      tlName: tl?.full_name || 'No member',
      tlEmail: tl?.email || 'No member',
      tlPhone: tl?.phone_number || 'No member',
      tm1Name: tm1?.full_name || 'No member',
      tm1Email: tm1?.email || 'No member',
      tm1Phone: tm1?.phone_number || 'No member',
      tm2Name: tm2?.full_name || 'No member',
      tm2Email: tm2?.email || 'No member',
      tm2Phone: tm2?.phone_number || 'No member',
      tm3Name: tm3?.full_name || 'No member',
      tm3Email: tm3?.email || 'No member',
      tm3Phone: tm3?.phone_number || 'No member',
      collegeName: tl?.college_name || 'N/A',
      location: tl?.location || 'N/A',
      projectTitle: sub.project_title || 'N/A',
      projectDescription: sub.project_description || 'N/A',
      pdfLink: sub.pdf_url || 'N/A',
      submitDate: new Date(sub.created_at).toLocaleDateString(),
      sdgs: sub.sdg_goal || 'N/A',
      shortlisting: '' // For CSV column
    };
  });

  const filteredData = processedData.filter(d => 
    d.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportExcel = () => {
    const headers = [
      "S.no", "Team Name", "TL Name", "TL Email", "TL Phone",
      "TM1 Name", "TM1 Email", "TM1 Phone", "TM2 Name", "TM2 Email", "TM2 Phone",
      "TM3 Name", "TM3 Email", "TM3 Phone", "College Name", "Location (City, State)",
      "Project Title", "Project Description", "PDF Link", "Submit Date", "SDGs", "Shortlisting (Shortlisted/Rejected/Waiting List)"
    ];

    const excelData = filteredData.map((row, i) => ([
      i + 1, row.teamName, row.tlName, row.tlEmail, row.tlPhone,
      row.tm1Name, row.tm1Email, row.tm1Phone, row.tm2Name, row.tm2Email, row.tm2Phone,
      row.tm3Name, row.tm3Email, row.tm3Phone, row.collegeName, row.location,
      row.projectTitle, row.projectDescription, row.pdfLink, row.submitDate, row.sdgs, row.shortlisting
    ]));

    excelData.unshift(headers);

    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jury Export");

    XLSX.writeFile(workbook, "jury_export.xlsx");
  };

  return (
    <>
        {/* TOP NAV */}
        <header style={{ height:64, background:S.card, borderBottom:'1px solid '+S.border, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div>
              <h1 style={{ fontSize:18, fontWeight:700, margin:0, color:S.t1 }}>Jury (Excel Export)</h1>
              <div style={{ fontSize:11, fontWeight:500, color:S.t2 }}>Export comprehensive team details for jury evaluation</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, borderLeft:'1px solid '+S.border, paddingLeft:20, cursor:'pointer' }}>
              <div style={{ width:34, height:34, borderRadius:'50%', background:'#059669', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:14 }}>A</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:S.t1 }}>{adminName}</div>
                <div style={{ fontSize:11, fontWeight:500, color:S.t2 }}>Super Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div style={{ flex:1, overflowY:'auto', padding:S.pad, display:'flex', flexDirection:'column', gap:S.gap }}>
          
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
            <div>
              <h2 style={{ fontSize:20, fontWeight:700, margin:0 }}>Submissions for Jury</h2>
              <p style={{ fontSize:13, color:S.t2, margin:'4px 0 0' }}>Total Submissions: <strong style={{color:S.primary}}>{filteredData.length}</strong></p>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <button onClick={exportExcel} style={{ display:'flex', alignItems:'center', gap:6, background:S.primary, color:'#fff', border:'none', padding:'10px 16px', borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer', boxShadow:'0 4px 12px rgba(108,78,255,0.2)' }}>
                <Download size={16}/> Export Excel
              </button>
            </div>
          </div>

          <div style={{ background:S.card, border:'1px solid '+S.border, borderRadius:S.radius, boxShadow:'0 1px 3px rgba(0,0,0,.04)', display:'flex', flexDirection:'column' }}>
            
            <div style={{ padding:'20px', borderBottom:'1px solid '+S.border, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, flex:1, flexWrap:'wrap' }}>
                <div style={{ position:'relative', minWidth:260 }}>
                  <Search size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:S.t3 }}/>
                  <input 
                    placeholder="Search by team name or project title..." 
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft:36, paddingRight:16, paddingTop:10, paddingBottom:10, background:S.card, border:'1px solid '+S.border, borderRadius:8, fontSize:13, width:'100%', outline:'none', color:S.t1 }}
                  />
                </div>
              </div>
            </div>

            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead>
                  <tr style={{ background:'#FAFAFA', borderBottom:'1px solid '+S.border }}>
                    <th style={{ padding:'16px 20px', fontWeight:600, color:S.t2, textAlign:'left' }}>S.No</th>
                    <th style={{ padding:'16px 20px', fontWeight:600, color:S.t2, textAlign:'left' }}>Team Name</th>
                    <th style={{ padding:'16px 20px', fontWeight:600, color:S.t2, textAlign:'left' }}>Project Title</th>
                    <th style={{ padding:'16px 20px', fontWeight:600, color:S.t2, textAlign:'left' }}>TL Name</th>
                    <th style={{ padding:'16px 20px', fontWeight:600, color:S.t2, textAlign:'left' }}>College & Location</th>
                    <th style={{ padding:'16px 20px', fontWeight:600, color:S.t2, textAlign:'left' }}>PDF Link</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice(0, 50).map((row, i) => (
                    <tr key={i} style={{ borderBottom:'1px solid #F8FAFC' }}>
                      <td style={{ padding:'16px 20px', color:S.t2, fontSize:12, fontWeight:600 }}>{i + 1}</td>
                      <td style={{ padding:'16px 20px', fontWeight:600, color:S.t1 }}>{row.teamName}</td>
                      <td style={{ padding:'16px 20px', color:S.t1, maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.projectTitle}</td>
                      <td style={{ padding:'16px 20px', color:S.t2 }}>{row.tlName}</td>
                      <td style={{ padding:'16px 20px', color:S.t2 }}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 150 }}>{row.collegeName}</div>
                        <div style={{ fontSize: 11, color: S.t3 }}>{row.location}</div>
                      </td>
                      <td style={{ padding:'16px 20px' }}>
                        {row.pdfLink !== 'N/A' ? (
                          <a href={row.pdfLink} target="_blank" rel="noopener noreferrer" style={{ color: S.primary, textDecoration: 'none', fontWeight: 600 }}>View PDF</a>
                        ) : 'No PDF'}
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ padding:'40px 20px', textAlign:'center', color:S.t3 }}>No submissions found matching your search.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {filteredData.length > 50 && (
              <div style={{ padding:'16px 20px', borderTop:'1px solid '+S.border, textAlign:'center', color:S.t3, fontSize:12 }}>
                Showing first 50 results in preview. Export Excel to view all {filteredData.length} records.
              </div>
            )}
          </div>
        </div>
    </>
  );
}

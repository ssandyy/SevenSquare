import React from 'react'

const Datatable = () => {
  return (
    <>
        <div className="container">
            <h1>Datatable</h1>
            <div className="add-container">
                <div className="info-container">
                    <input type="text" name="fname"  placeholder="First Name" value={""} onChange={() => {}} />
                    <input type="text" name="lname"  placeholder="Last Name" value={""} onChange={() => {}} />
                    <input type="email" name="email"  placeholder="Email" value={""} onChange={() => {}} />
                    <input type="text" name="phone"  placeholder="Phone" value={""} onChange={() => {}} />
                    <input type="text" name="resume_url"  placeholder="Profile Url" value={""} onChange={() => {}} />
                    <input type="text" name="source"  placeholder="Linkedin, Monster, CB, .." value={""} onChange={() => {}} />
                </div>
                <button>Add</button>
                <div className="search-table-container">
                    <input className="search-input" type="text" placeholder="Search By name" value={""} onChange={() => {}} />
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Resume URL</th>
                            <th>Source</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                    <div className="pagination">

                    </div>
                </table>
            </div>
        </div>
    </>
    
  )
}

export default Datatable
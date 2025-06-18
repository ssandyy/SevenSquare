import React from 'react'

const Datatable = () => {

    const  [formData, setFormData] = use
    
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
                <button className="add">Add</button>
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
                            <th>Profile-URL</th>
                            <th>Source</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* <tr>
                            <td>sandeep Kumar</td>
                            <td>Yadav</td>
                            <td>ssandyy@gmail.com</td>
                            <td>9955646562</td>
                            <td>https//monster.com</td>
                            <td>Monster</td>
                            <td className="actions">
                                <button className="edit">Edit</button>
                                <button className="delete">Delete</button>
                            </td>
                        </tr> */}
                    </tbody>
                </table>
                <div className="pagination"></div>
            </div>
        </div>
    </>
    
  )
}
export default Datatable
import { useEffect, useState } from 'react'
import './App.css'
import { UserData } from './Database/Localdatabase'

function App() {
  

  // const [formData, setFormData] = useState({
  //   firstName: '',
  //   lastName: '',
  //   email: '',
  //   phone: ''
  // })
  //or

  const [data, setData] = useState([])
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const [id, setId] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [searchItem, setSearchItem] = useState('')
 


  //Add new data object in available array-object/Database..!
  const AddTask = (e) => {
    e.preventDefault();
    
    // const AvailableUser = [...data]; //fetch existing data
    // const newUser =  {
    //   id: Date.now(),
    //   firstName: firstName,
    //   lastName: lastName,
    //   email: email,
    //   phone: phone
    // }
    // AvailableUser.push(newUser)
    // setData(AvailableUser);
    // resetForm();

    // or

    const AvailableUser = { id: Date.now(), firstName, lastName, email, phone}
    setData(...data, ...AvailableUser)
  }


  // TO Bring data in form fields
  const editUser = (id) => {
      const editSelectedUser = data.filter(userdata => userdata.id === id);
      if(editSelectedUser !== undefined){
        setIsEditing(true);
        setId(id)
        setFirstName(editSelectedUser[0].firstName);
        setLastName(editSelectedUser[0].lastName);
        setEmail(editSelectedUser[0].email);
        setPhone(editSelectedUser[0].phone);
      }
  }

// Update the data of selected and puch on available datas
  const handleUpdate = () =>{
   const index2 = data.map((item) => item.id)
                      .indexOf(id); // on edit we get id and on that basis we will find the index of item
    
    const dt = [...data];
      dt[index2].firstName = firstName;
      dt[index2].lastName = lastName;
      dt[index2].email = email;
      dt[index2].phone = phone;

      setData(dt)
      resetForm();
      setIsEditing(false);
  }

// delete selected user from database..
  const deleteUser = (id) => {
    if(id > 0){
      if(window.confirm("Are you sure want to delete user?"+id)){
        const AvailableUsers = data.filter((item) => item.id !== id);
        setData(AvailableUsers)   
      }
    }
  }

  function resetForm() {
    setId(0);
    setFirstName('')
    setLastName('')
    setEmail('')
    setPhone('')

  }

   useEffect(() => {
    setData(UserData)   
  },[])



  const filteredUsers = data.filter(
    (user) => `${user.firstName} ${user.lastName} ${email}`.toLowerCase().includes(searchItem.toLowerCase()) ||
              user.email.toLowerCase().includes(searchItem.toLowerCase()) ||
              user.phone.includes(searchItem)
  )


  return (
    <>
    <div>
          <div>
            <input 
              type="text"
              placeholder='First Name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input 
              type="text"
              placeholder='Last Name'
              value={lastName}
              onChange={(e)=> setLastName(e.target.value)}
              required
            />
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email'
              required
            />
            <input 
              type="tel"
              placeholder='phone number'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            {
              // isEditing === false ? 
              !isEditing ?
              <> 
                <button className='btn' onClick={AddTask}><i className="fas fa-user" > </i> Add New  User</button>
                <button className='btn' style={{background:"Reset"}} onClick={resetForm}>Reset</button>
              </>
              :
              <button className='btn' style={{background:"orange"}} onClick={handleUpdate}><i className="fas fa-update"> </i> Update User</button>
            }
        </div>
    </div>
      
    <div>
      <input 
        type="text"
        value={searchItem}
        onChange={(e) => setSearchItem(e.target.value)}
        placeholder='search here..'
      />
      <button onClick={() => setSearchItem('')}>Clear</button>
    </div>
          
    <div>
        {/* Data Table  */}
        <table className="table-container">
          <thead >
            <tr>
              <th>Serial No.</th>
              <th>User-id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.id}</td>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td className="actions">
                    <button onClick={() => editUser(user.id)} className="btn-edit">
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button onClick={() => deleteUser(user.id)} className="btn-delete">
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-users">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
{/* <form
          onSubmit={(e) => {
            e.preventDefault();
            isEditing ? updateUser() : addUser();
          }}
        >
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
          />
          <button type="submit">{isEditing ? "Update" : "Add"} User</button>
          {isEditing && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </form> */}
    </>
  )
}


export default App

import { useEffect, useRef, useState } from 'react';

const Datatable = () => {

    const  [formData, setFormData] = useState({fname:"", lname:"", email:"", phone:"", resume_url:"", source:""})
    const [data, setData] = useState([])
   
    // Pagination
    const [currentPage, setCurrentpage] = useState(1);
    const itemsPerPage = 5; 
    const [searchTerm, setSearchTerm] = useState("");
    const LastItem = currentPage * itemsPerPage; 
    const FirstItem = LastItem - itemsPerPage;
   
    const filteredElement = data.filter(item => 
        item.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const filteredData = filteredElement.slice(FirstItem, LastItem);
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    const paginate = (pageNumber) => {
        setCurrentpage(pageNumber);
        
    }


    //edit functionality
    const [editId, SetEditId] = useState(false)
    const outsideClick = useRef(false)

    //select and show the item to edited 
    useEffect(() => {
      if (!editId) return;
      
      let selectedItem = document.querySelectorAll(`[id='${editId}']`);
        selectedItem[1].focus(); // place where cursor should blink 
    }, [editId]);


    useEffect(() => {
        setCurrentpage(1); // Reset to first page when data changes
    },[searchTerm]);

    
    //disable the edit function after clicking outside to prevent upnormal edit after saving it should only be activated on edit button click
    useEffect(() => {
        const handleClickOutside = (eventz) => {
            if(outsideClick.current && !outsideClick.current.contains(eventz.target)){
                SetEditId(false)
            }
        }
        document.addEventListener("click", handleClickOutside)
        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    }, [])



    //EDIT
    const handleEdit = (id, updatedData) =>{
        if(!editId || editId !==id) { return } // if edit id is false or editid is not equals to passed id then return as it is 
        
        const updateList = data.map((item) =>              // map of each of element trough data
            item.id === id ? {...item, ...updatedData}:item)// ternery operator -> if item.id is equal to id then return object with rest of item + upated data else return item
            setData(updateList);
    }
    
    // console.log(data);
    

    const handleInputChange = (e) => {
        // e.preventDefault();
        setFormData({...formData, [e.target.name]: e.target.value})   
    }
    // console.log(formData);

    const handleAddClick = () => {
        if(formData.fname && formData.lname && formData.email && formData.phone){
            const newItem = {
                id: Date.now(),  // generate unique id 
                fname: formData.fname,
                lname: formData.lname,
                email: formData.email,
                phone: formData.phone,
                resume_url: formData.resume_url,
                source: formData.source
            };
            setData([...data, newItem]);
            setFormData({fname:"", lname:"", email:"", phone:"", resume_url:"", source:""})
        }
    }
    // console.log(data);

    const handleDeleteButton = (id) => {
        if(filteredData.length === 1 && currentPage > 1){
            setCurrentpage((prev) => prev -1);
        }
        const updateList = data.filter((item)=> item.id !==id);
        setData(updateList)
    }
    

    
  return (
    <>
        <div className="container">
            <h1>Datatable</h1>
            <div className="add-container">
                <div className="info-container">
                    <input type="text" name="fname"  placeholder="First Name" value={formData.fname} onChange={handleInputChange} />
                    <input type="text" name="lname"  placeholder="Last Name" value={formData.lname} onChange={handleInputChange} />
                    <input type="email" name="email"  placeholder="Email" value={formData.email} onChange={handleInputChange} />
                    <input type="text" name="phone"  placeholder="Phone" value={formData.phone} onChange={handleInputChange} />
                    <input type="text" name="resume_url"  placeholder="Profile Url" value={formData.resume_url} onChange={handleInputChange} />
                    <input type="text" name="source"  placeholder="Linkedin, Monster, CB, .." value={formData.source} onChange={handleInputChange} />
                </div>
                <button className="add" onClick={handleAddClick}>+Add New Data</button>
                <div className="search-table-container">
                    <input className="search-input" type="text" placeholder="Search By name" value={searchTerm} onChange={handleSearch} />
                </div>
                <table ref={outsideClick}>
                    <thead>
                        <tr>
                            <th>ID</th>
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

                        {filteredData.map((item) => (
                            <tr key={item.id}>
                            <td id={item.id}>{item.id}</td>
                            <td id={item.id} contentEditable={editId === item.id} onBlur={(e) =>  handleEdit(item.id, {fname:e.target.innerHTML})}>{item.fname}</td>
                            <td id={item.id} contentEditable={editId === item.id} onBlur={(e) => handleEdit(item.id, {lname:e.target.innerHTML})}>{item.lname}</td>
                            <td id={item.id} contentEditable={editId === item.id} onBlur={(e) => handleEdit(item.id, {email:e.target.innerHTML})}>{item.email}</td>
                            <td id={item.id} contentEditable={editId === item.id} onBlur={(e) => handleEdit(item.id, {phone:e.target.innerHTML})}>{item.phone}</td>
                            <td id={item.id} contentEditable={editId === item.id} onBlur={(e) => handleEdit(item.id, {resume_url:e.target.innerHTML})}>{item.resume_url}</td>
                            <td id={item.id} contentEditable={editId === item.id} onBlur={(e) => handleEdit(item.id, {source:e.target.innerHTML})}>{item.source}</td>
                            <td className="actions">
                                <button className="edit" onClick={() => SetEditId(item.id)}>Edit</button>
                                <button className="delete" onClick={() => handleDeleteButton(item.id)}>Delete</button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    {Array.from({length: Math.ceil(filteredElement.length / itemsPerPage)}, (_, index) => (
        
                        <button key={index+1} onClick={() => paginate(index+1)}style={{backgroundColor:currentPage === index+1 && "lightcoral" }}>{index+1}</button>
                    ))}
                </div>
            </div>
        </div>
    </>
    
  )
}
export default Datatable
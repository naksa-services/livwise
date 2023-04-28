import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { AddUser, GetDevices, GetUsers, PostUsers, RemoveUser, UpdateUser } from '../api'
import { useState, useEffect } from 'react';
import Footer from './Footer';
import Header from './Header';
import DataTable from 'react-data-table-component';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form, ToggleButton } from 'react-bootstrap';
import React from 'react';
import { render } from '@testing-library/react';
import { FaCheck } from 'react-icons/fa';
import LoadingIndicator from '../components/LoadingIndicator';
import AlertMessage from './constrants/messagealert';


export default function User() {
    const [addmodalShow, setaddModalShow] = React.useState(false);
    const [assmodalShow, setassModalShow] = React.useState(false);
    const [delmodalShow, setdelModalShow] = React.useState(false);
    const [selected, setSelected] = React.useState(false);
    const [isloading, setisloading] = useState(false);
    const [alert, setAlert] = useState(false);
    const [errmessagetype, seterrmessagetype] = useState('');
    const [errmessage, seterrmessage] = useState('');
    const [show, setShow] = useState(false);
    const [editdata, seteditdata] = useState({});
    const [editmodalshow, seteditmodalshow] = useState(false);
    const [ddata, setddata] = useState([])
    const [selectedid, setSelecteddid] = useState('');
    const GetUserData = () => {
        setisloading(true);
        GetUsers().then((res) => {
            setddata(res);
            console.log(res)
            setisloading(false);
        })
    }
    const onSubmitForm = (body) => {
        debugger;
        AddUser(body).then((res) => {
            if (res.msg === "Saved") {
                setaddModalShow(false);
                setShow(false);
                setAlert(true);
                seterrmessagetype('success');
                seterrmessage('Data Inserted successfuly');
                GetUserData();
            }
            else {
                setaddModalShow(false);
                setShow(false);
                setAlert(true);
                seterrmessagetype('failed');
                seterrmessage('Something went wrong!, Please try again..');
            }
        })
    }

    const onEditSubmit = (body) => {
        debugger;
        UpdateUser(body).then((res) => {
            if (res.msg === "Saved") {
                seteditmodalshow(false);
                setShow(false);
                setAlert(true);
                seterrmessagetype('success');
                seterrmessage('Data Updated successfuly');
                GetUserData();
            }
            else {
                seteditmodalshow(false);
                setShow(false);
                setAlert(true);
                seterrmessagetype('failed');
                seterrmessage('Something went wrong!, Please try again..');
            }
        })
    }

    const oneditmodaal = (body) => {
        console.log(body);
        seteditdata(body);
        seteditmodalshow(true);
    }


    const column = [
        {
            name: " User ID",
            selector: (row) => row.userid,
            sortable: true
        },
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true
        },
        {
            name: "Number",
            selector: (row) => row.mobile,
            sortable: true
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true
        },
        {
            name: "Password",
            selector: (row) => row.password,
            sortable: true
        },



        {
            name: "Status",
            selector: (row) => <ToggleButton
                value="check"
                color='red'

                selected={selected}
                onChange={() => {
                    setSelected(!selected);
                }}
            >
                <FaCheck />
            </ToggleButton>,
            sortable: true
        },
        {
            name: "Action",
            selector: (row) => <div > <h5 ><i onClick={() => oneditmodaal(row)} className="fa fa-edit newc"></i><i onClick={() => deleteModalShow(row.userid)} className="fa fa-trash newc"></i></h5></div>,
            sortable: true
        },

    ]
    const deleteModalShow = (id) => {
        setSelecteddid(id);
        setdelModalShow(true)
    }
    const [devices, setDevices] = useState([]);
    const navigate = useNavigate();
    const goToDeviceData = (d) => {
        navigate(`/devicenode?deviceId=${d.deviceId}`);
    }

    useEffect(() => {
        // setDevices(ddata)
        GetUserData();
        // GetDevices().then(res => {
        //     if (res && res.data) {

        //         console.log(res.data);
        //     }
        // })
    }, [])
    const OnDeleteForm = (userid) => {
        RemoveUser(userid).then((res) => {
            if (res.msg === "Deleted") {
                setdelModalShow(false);
                setShow(false);
                setAlert(true);
                seterrmessagetype('success');
                seterrmessage('Data Deleted successfuly');
                GetUserData();
            }
            else {
                setdelModalShow(false);
                setShow(false);
                setAlert(true);
                seterrmessagetype('danger');
                seterrmessage('Something went wrong, please try again...');
            }
        })
    }

    return <div style={{ display: 'block' }} className="maindev">

        <div>
            <Header />
            <div className="row">
                <div className="col-md-12">
                    <AlertMessage
                        show={alert}
                        onhide={() => setAlert(false)}
                        data={errmessagetype}
                        message={errmessage}
                    />
                </div>
                <div className="col-md-12">
                    {
                        isloading !== true ?
                            <div className='card cdn1223'>
                                <DataTable className='striped hover ' style={{ textAlign: "center", borderRadius: "10px" }} columns={column}
                                    data={ddata}
                                    pagination
                                    fixedHeader
                                    fixedHeaderScrollHeight='500px'
                                    highlightOnHover
                                    subHeader
                                    subHeaderComponent={

                                        <div>
                                            <input type="text" placeholder='Search Here' className='w-25 form-control search-c' />
                                            <div>
                                                <button onClick={() => setaddModalShow(true)} style={{ float: "left", marginRight: "10px", padding: "6px", borderRadius: "5px", border: "2px solid transparent", boxShadow: " 0 0 2px #000", backgroundColor: "white" }}>Add User</button>

                                            </div>
                                        </div>
                                    }
                                />
                            </div>
                            : <div><LoadingIndicator /></div>
                    }
                </div>
            </div>
        </div>
        <Footer />

        <AddModal
            show={addmodalShow}
            onHide={() => setaddModalShow(false)}
            onSubmitForm={onSubmitForm}

        />
        <EditModal
            show={editmodalshow}
            onHide={() => seteditmodalshow(false)}
            submitTagData={onEditSubmit}
            bn={editdata}
        />
        <DeleteModal
            show={delmodalShow}
            onHide={() => setdelModalShow(false)}
            deleteid={selectedid}
            deletedata={OnDeleteForm}
        />
    </div>
};






function AddModal(props1) {
    const { show, onHide, onSubmitForm, } = props1;
    const [user, setUser] = useState({});
    const onSubmitData = (event) => {
        event.preventDefault();
        onSubmitForm(user);

    }
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setUser(values => ({ ...values, [name]: value }))
    }
    return (
        <Modal
            {...props1}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <div className=' modal-title' id="contained-modal-title-vcenter">
                    <h6 className=''>Add User</h6>
                </div>
            </Modal.Header>
            <Modal.Body>
                <form >
                    <div className="row">
                        <div className="col-md-6">
                            {/* <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>User ID</Form.Label>
                                <Form.Control type="email" placeholder="Enter User ID" />

                            </Form.Group> */}
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>User Name</Form.Label>
                                <Form.Control type="text" name='name' value={user.name || ""}
                                    onChange={handleChange} placeholder="Enter Username" />

                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label> Email</Form.Label>
                                <Form.Control type="email" name='email' value={user.email || ""}
                                    onChange={handleChange} placeholder="Enter Email" />

                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Registration Date</Form.Label>
                                <Form.Control type="Date" name='regdate' value={user.regdate || ""}
                                    onChange={handleChange} placeholder="Enter Date" />

                            </Form.Group>
                        </div>

                        <div className="col-md-6">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Mobile Number</Form.Label>
                                <Form.Control type="text" name='mobile' value={user.mobile || ""}
                                    onChange={handleChange} placeholder="Enter Mobile number" />

                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>User Password</Form.Label>
                                <Form.Control type="text" name='password' value={user.password || ""}
                                    onChange={handleChange} placeholder="Enter Password" />

                            </Form.Group>


                            {/* <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Location</Form.Label>
                                <Form.Control type="text" placeholder="Enter Location" />

                            </Form.Group> */}
                            {/* <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Status</Form.Label>
                                <Form.Select >
                                    <option>Select Role</option>
                                    <option>Admin</option>
                                    <option>Sub User</option>
                                    <option>User</option>
                                </Form.Select>
                            </Form.Group> */}
                        </div>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>

                <Button onClick={props1.onHide} >Close</Button>
                <Button onClick={onSubmitData}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}
function EditModal(props1) {
    const { show, onHide, submitTagData, bn } = props1;
    var bnlength = Object.keys(bn).length;
    let separator = '/'
    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    var datenow = `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`


    const initialValues = { name: '', email: '', mobile: '' };
    const [formValues, setformValues] = useState(initialValues);
    const [formErrors, setformErros] = useState({});
    const [fsubmit, fissubmit] = useState(false);
    const [userdata, setuserdata] = useState({})
    const handleChange = (e) => {
        const { name, value } = e.target;
        setformValues({ ...formValues, [name]: value });
        console.log(formValues);
    }
    const validate = (value) => {
        const error = {};
        if (!value.name) {
            error.name = "Name is required";
        }
        if (!value.email) {
            error.email = "Email is required";
        }
        if (!value.mobile) {
            error.mobile = "Mobile number is required";
        }


        return error;
    }
    const LoginFunc = (e) => {

        e.preventDefault();

        const body = {
            name: formValues.name,
            email: formValues.email,
            mobile: formValues.mobile,
            userid: bn.userid,
            regdate: datenow
        }
        submitTagData(body);

    }

    useEffect(() => {

        setformValues({ ...formValues, name: "", email: "", mobile: "" })


    }, [])
    // useEffect(() => {
    //     // console.log(bn);
    //     console.log("vhjvh" + show);
    //     console.log(formValues);
    //     if (Object.keys(formErrors).length === 0 && fsubmit) {
    //         console.log(formValues);

    //         let body = {
    //             userid: bn.userid,
    //             name: formValues.name,
    //             email: formValues.email,
    //             mobile: formValues.mobile,
    //             regdate: datenow
    //         };
    //         // SubmitloginForm(formValues);
    //     }

    // }, { formErrors })


    return (
        <Modal
            {...props1}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <div className=' modal-title' id="contained-modal-title-vcenter">
                    <h6 className=''>Edit User</h6>
                </div>
            </Modal.Header>
            <Modal.Body>
                <form >
                    <div className="row">
                        <div className="col-md-6">
                            {/* <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>User ID</Form.Label>
                                <Form.Control type="email" placeholder="Enter User ID" />

                            </Form.Group> */}
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>User Name</Form.Label>

                                <Form.Control name='name' value={formValues.name} onChange={(e) => setformValues({ ...formValues, name: e.target.value })} type="text" placeholder="Enter Name" />
                                <p style={{ color: "red" }}>{formErrors.name}</p>

                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label> Email</Form.Label>

                                <Form.Control name='email' value={formValues.email} onChange={(e) => setformValues({ ...formValues, email: e.target.value })} type="text" placeholder="Enter Email" />
                                <p style={{ color: "red" }}>{formErrors.email}</p>

                            </Form.Group>


                        </div>

                        <div className="col-md-6">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Mobile Number</Form.Label>

                                <Form.Control name='mobile' value={formValues.mobile} onChange={(e) => setformValues({ ...formValues, mobile: e.target.value })} type="text" placeholder="Enter mobile number" />
                                <p style={{ color: "red" }}>{formErrors.mobile}</p>

                            </Form.Group>





                        </div>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>

                <Button onClick={props1.onHide} >Close</Button>
                {/* <Button onClick={onSubmitData}>Submit</Button> */}
                <Button variant="primary" onClick={LoginFunc}>Update  </Button>
            </Modal.Footer>
        </Modal>
    );
}

function DeleteModal(props2) {
    const { show, onhide, deletedata, deleteid } = props2;

    const onSubmit = () => {
        deletedata(deleteid);
    }
    return (
        <Modal
            {...props2}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <div className=' modal-title' id="contained-modal-title-vcenter">
                    <h6 className=''>Delete User</h6>
                </div>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure ? You want to delete</p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props2.onHide}>Close</Button>
                <Button onClick={onSubmit}>Delete</Button>
            </Modal.Footer>
        </Modal>
    );
}

import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { GetDevices } from '../api';
import { Deviceinfo } from '../api';
import { AddDeviceInfo } from '../api';
import { RemoveDeviceInfo } from '../api';
import { } from '../api';
import { useState, useEffect } from 'react';
import Footer from './Footer';
import Header from './Header';
import DataTable from 'react-data-table-component';
import Dropdown from 'react-bootstrap/Dropdown';
import { Form } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import LoadingIndicator from '../components/LoadingIndicator';
import AlertMessage from './constrants/messagealert';



export default function DeviceInfo() {
    const [addmodalShow, setaddModalShow] = useState(false);
    const [delmodalshow, setdelModalShow] = useState(false);
    const [editdata, seteditdata] = useState({})
    const [selectedid, setselectedid] = useState('');
    const [file, setFile] = useState();
    const [devicename, setDevicename] = useState([]);
    const [isloading, setisloading] = useState(false);
    const [searchdata, setsearchdata] = useState('');
    const [alert, setAlert] = useState(false);
    const [errmessagetype, seterrmessagetype] = useState('');
    const [errmessage, seterrmessage] = useState('');
    const [editmodalShow, seteditmodalShow] = useState(false);
    const [show, setShow] = useState(false);


    function handleChange(e) {
        console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]));
        setDevicename(e.target.value);

    }
    const gotoDeviceNode = (d) => {
        navigate(`/devicenode?deviceId=${d.deviceid}`);
    }



    const column = [
        {
            name: "Device ID",
            selector: (row) => row.deviceid,
            sortable: true
        },
        {
            name: "devicename",
            selector: (row) => <p onClick={() => gotoDeviceNode(row)}>{row.devicename}</p>,
            sortable: true
        },
        {
            name: "friendlyname",
            selector: (row) => row.friendlyname,
            sortable: true
        },
        {
            name: "Device key",
            selector: (row) => row.devicekey,
            sortable: true
        },
        {
            name: "Device logo",
            selector: (row) => row.devicelogo,
            sortable: true
        },
        {
            name: "Message",
            selector: (row) => row.devicedesc,
            sortable: true
        },
        {
            name: "Action",
            selector: (row) => <div className='row'> <div className="col-md-6" onClick={() => showEditModel(row)}><i className='fa fa-edit'></i></div> <div className="col-md-6" onClick={() => showDeleteModal(row.deviceid)}><i className='fa fa-trash '></i></div></div>,
            sortable: true
        },

    ]

    const navigate = useNavigate();
    const [device, setDevice] = useState([])

    useEffect(() => {
        Deviceinfos()
    }, [])

    useEffect(() => {
        const resultdata = device.filter((item) => {
            return item.devicename.toLowerCase().match(searchdata.toLowerCase());
        });
        searchdata != '' ? setDevice(resultdata) : Deviceinfos()
    }, [searchdata])

    ///////////// Data geting ////////////////

    const Deviceinfos = () => {
        setisloading(true);
        Deviceinfo()
            .then(res => {
                if (res) {
                    setisloading(false)
                    setDevice(res)
                }
            })
    }
    const onSubmitForm = (body) => {

        // console.log("Submitted")
        AddDeviceInfo(body).then((res) => {
            if (res.msg === "Saved") {
                setShow(false);
                setAlert(true);
                seterrmessagetype('success');
                seterrmessage('Data Inserted successfuly');
                setaddModalShow(false);
                Deviceinfos();
            }
            else {
                setaddModalShow(false);
                setShow(false);
                setAlert(true);
                seterrmessagetype('failed');
                seterrmessage('Something went wrong!, Please try again..');
                Deviceinfos();
            }

        })

    }

    const showDeleteModal = (item) => {
        console.log(item);
        setselectedid(item)
        setdelModalShow(true);
    }
    const showEditModel = (item) => {
        // console.log(item);

        seteditdata(item);
        seteditmodalShow(true);

    }
    const onEditSubmit = () => {

    }

    const OnDeleteForm = (deviceid) => {
        const data = {
            deviceid: deviceid
        };
        console.log(data);
        RemoveDeviceInfo(data).then((res) => {
            console.log(res.msg)
            console.log(res)
            if (res.msg === "Deleted") {
                console.log("dn")
                setAlert(true);
                setShow(false);
                seterrmessagetype('danger');
                seterrmessage(`${res.msg} succesfully`);
                setdelModalShow(false);
                Deviceinfos();
            }
            if (res.msg === "Something Went Wrong..") {
                console.log("Something went wrong")
                setdelModalShow(false);
            }
            else {
                setdelModalShow(false);
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
                                    data={device}
                                    pagination
                                    fixedHeader
                                    fixedHeaderScrollHeight='500px'
                                    highlightOnHover
                                    subHeader
                                    subHeaderComponent={

                                        <div>
                                            <input type="text" placeholder='Search Here' value={searchdata} onChange={(e) => setsearchdata(e.target.value)} className='w-25 form-control search-c' />
                                            <div>
                                                <button onClick={() => setaddModalShow(true)} style={{ float: "left", marginRight: "10px", padding: "6px", borderRadius: "5px", border: "2px solid transparent", boxShadow: " 0 0 2px #000", backgroundColor: "white" }}>Add Device</button>
                                                {/* <Dropdown style={{ float: "left" }}>
                                                    <Dropdown.Toggle variant="Secondary" id="dropdown-basic">
                                                        Filter Data
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Location</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Status</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Agent</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">User</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Device Type</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                            </div>
                                        </div>
                                    }
                                />
                            </div>
                            : <LoadingIndicator />
                    }
                </div>
            </div>
        </div>
        <Footer />
        <AddModal
            show={addmodalShow}
            onHide={() => setaddModalShow(false)}
            onSubmitForm={onSubmitForm}
            edidata={editdata}

        />
        <EditModal

            show={editmodalShow}
            onHide={() => seteditmodalShow(false)}
            submitTagData={onEditSubmit}
            bn={editdata}

        />
        <DeleteDeviceInfo
            show={delmodalshow}
            deleteid={selectedid}
            onHide={() => setdelModalShow(false)}
            deletedata={OnDeleteForm}
        />
    </div>
};

function AddModal(props1) {
    const { show, onHide, onSubmitForm, } = props1;
    const [devicename, setDevicename] = useState('');
    const [devicetypeid, setdevicetypeid] = useState('');
    const [friendlyname, setfriendlyname] = useState('');
    const [devicekey, setdevicekey] = useState('');
    const [devicedesc, setdevicedesc] = useState('');
    const [message, setMessage] = useState('');
    const [logo, setLogo] = useState([]);
    const [devicetype, setdevicetype] = useState([]);

    // const SubmitForm = () => {
    //     onSubmitForm(devicetype);
    //     setdevicetypeid('')  
    // }


    const onSubmitData = () => {
        const body = {
            devicetypeid: devicetypeid,
            devicename: devicename,
            friendlyname: friendlyname,
            devicekey: devicekey,
            devicedesc: devicedesc
        }
        console.log(body);
        onSubmitForm(body);
    }



    useEffect(() => {

        GetDevices().then((res) => {
            console.log(res)
            setdevicetype(res);
        })

    }, [])


    return (
        <Modal
            show={props1.show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={props1.onHide}
        >
            <Modal.Header closeButton>
                <div className=' modal-title' id="contained-modal-title-vcenter">
                    <h6 className=''>ADD Device Info</h6>

                </div>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="row">
                        <div className="col-md-6">

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Device Name</Form.Label>
                                <Form.Control type="text" name='devicename' onChange={(e) => setDevicename(e.target.value)} placeholder="Enter Device Name" />

                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Friendly name</Form.Label>
                                <Form.Control type="text" name='friendlyname' onChange={(e) => setfriendlyname(e.target.value)} placeholder="Enter Friendle Name" />

                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Device Key</Form.Label>
                                <Form.Control type="text" name='devicekey' onChange={(e) => setdevicekey(e.target.value)} placeholder="Enter Device Key" />

                            </Form.Group>


                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Select Device Type</Form.Label>
                                <select onChange={(e) => setdevicetypeid(e.target.value)} className='form-control'>

                                    {
                                        devicetype.map((item) => <option value={item.devicetypeid}>{item.devicetype}</option>)
                                    }

                                </select>
                            </Form.Group>
                            <div className="form-outline">
                                <label className="form-label" for="textAreaExample">Message</label>
                                <textarea className="form-control" name='devicedesc' onChange={(e) => setdevicedesc(e.target.value)} id="textAreaExample1" rows="4"></textarea>
                            </div>


                        </div>

                    </div>

                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Close</Button>
                <Button className='btn btn-success' onClick={onSubmitData}>Add Device</Button>
            </Modal.Footer>
        </Modal>
    );
}
function EditModal(props1) {

    const { show, onHide, submitTagData, bn } = props1;

    const [devicetype, setdevicetype] = useState([]);

    var bnlength = Object.keys(bn).length;
    let separator = '/'
    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    var datenow = `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`

    const initialValues = { devicename: bnlength === 0 ? "" : bn.devicename, friendlyname: bnlength === 0 ? "" : bn.friendlyname, devicekey: bnlength === 0 ? "" : bn.devicekey, devicedesc: bnlength === 0 ? "" : bn.devicedesc };
    const [formValues, setformValues] = useState(initialValues);
    const [formErrors, setformErros] = useState({});
    const [fsubmit, fissubmit] = useState(false);
    const handleChange = (e) => {
        console.log(formValues);
        setformValues({ ...formValues, [e.target.name]: e.target.value });
        console.log(formValues);
    }

    const validate = (value) => {
        const error = {};
        if (!value.devicename) {
            error.devicename = "Devicename is required";
        }
        if (!value.friendlyname) {
            error.friendlyname = "Friendlyname is required";
        }
        if (!value.devicekey) {
            error.devicekey = "Device key is required";
        }
        if (!value.devicedesc) {
            error.devicedesc = "Device desc is required";
        }
        return error;
    }
    const LoginFunc = (e) => {

        e.preventDefault();
        setformErros(validate(formValues));
        fissubmit(true);

    }

    useEffect(() => {
        if (show === true && bnlength !== 0) {
            // alert(bn.bname)
            formValues.devicename = bn.devicename;
            formValues.friendlyname = bn.friendlyname;
            formValues.devicedesc = bn.devicedesc;
            formValues.devicekey = bn.devicekey;


        }
        // console.log(bn);
        console.log("vhjvh" + show);
        console.log(formValues);
        if (Object.keys(formErrors).length === 0 && fsubmit === true) {
            console.log(formValues);

            let body = {
                devicetypeid: bn.devicetypeid,
                devicename: formValues.devicename,
                friendlyname: formValues.friendlyname,
                devicedesc: formValues.devicedesc,
                devicekey: formValues.devicekey,
                regdate: datenow
            };
            submitTagData(formValues);
        }

    }, [])

    // const SubmitForm = () => {
    //     onSubmitForm(devicetype);
    //     setdevicetypeid('')  
    // }


    // const onSubmitData = () => {
    //     const body = {
    //         devicetypeid: devicetypeid,
    //         devicename: devicename,
    //         friendlyname: friendlyname,
    //         devicekey: devicekey,
    //         devicedesc: devicedesc
    //     }
    //     console.log(body);
    //     onSubmitForm(body);
    // }



    useEffect(() => {

        GetDevices().then((res) => {
            console.log(res)
            setdevicetype(res);
        })

    }, [])


    return (
        <Modal
            show={props1.show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={props1.onHide}
        >
            <Modal.Header closeButton>
                <div className=' modal-title' id="contained-modal-title-vcenter">
                    <h6 className=''>ADD Device Info</h6>

                </div>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="row">
                        <div className="col-md-6">

                            <Form.Group className="mb-3" controlId="devicename">
                                <Form.Label>Device Name</Form.Label>
                                <Form.Control name='devicename' value={formValues.devicename} onChange={handleChange} type="text" placeholder="Enter Device Name" />
                                <p style={{ color: "red" }}>{formErrors.devicename}</p>

                            </Form.Group>
                            <Form.Group className="mb-3" controlId="friendlyname">
                                <Form.Label>Friendly name</Form.Label>
                                <Form.Control name='friendlyname' value={formValues.friendlyname} onChange={handleChange} type="text" placeholder="Enter friendlyname" />
                                <p style={{ color: "red" }}>{formErrors.friendlyname}</p>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="devicekey">
                                <Form.Label>Device Key</Form.Label>
                                <Form.Control name='devicekey' value={formValues.devicekey} onChange={handleChange} type="text" placeholder="Enter evice key" />
                                <p style={{ color: "red" }}>{formErrors.devicekey}</p>
                            </Form.Group>


                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Select Device Type</Form.Label>
                                <select onChange={(e) => formValues.devicetype(e.target.value)} className='form-control'>

                                    {
                                        devicetype.map((item) => <option value={item.devicetypeid}>{item.devicetype}</option>)
                                    }

                                </select>
                            </Form.Group>
                            <div className="form-outline">
                                <label className="form-label" for="textAreaExample">Message</label>

                                <textarea className="form-control" name="devicedesc" value={formValues.devicedesc} onChange={handleChange} id="textAreaExample1" rows="4"></textarea>
                                <p style={{ color: "red" }}>{formErrors.devicedesc}</p>
                            </div>


                        </div>

                    </div>

                </form>
            </Modal.Body>
            <Modal.Footer>
                {/* <Button onClick={onHide}>Close</Button>
                <Button className='btn btn-success' onClick={onSubmitData}>Add Device</Button> */}
                <Button onClick={props1.onHide} >Close</Button>
                {/* <Button onClick={onSubmitData}>Submit</Button> */}
                <Button variant="primary" onClick={LoginFunc}>Update  </Button>
            </Modal.Footer>
        </Modal>
    );
}


function DeleteDeviceInfo(props) {
    const { show, onHide, deletedata, deleteid } = props;
    const [deletemodel, setDeletemodel] = useState(false);
    const deleteDeviceinfo = () => {
        deletedata(deleteid);

    }
    return (
        <>


            <Modal
                show={props.show}
                //   onHide={onhide}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header >
                    <Modal.Title>Delete Device</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are You sure ? You want to delete Device with ID :  {props.deleteid}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={deleteDeviceinfo}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
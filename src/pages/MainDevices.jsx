import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { DeleteDeviceType, GetDevices, UpdateDeviceType } from '../api';
import { AddDeviceType } from '../api';
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


export default function MainDevices() {
    const [addmodalShow, setaddModalShow] = useState(false);
    const [delmodalshow, setdelModalShow] = useState(false);
    const [editdata, seteditdata] = useState({})
    const [isloading, setisloading] = useState(false);
    const [selectedid, setselectedid] = useState('');
    const [search, setsearch] = useState('');
    const [devices, setDevices] = useState([]);
    const [editmodalshow, seteditmodalshow] = useState(false);
    const [alert, setAlert] = useState(false);
    const [errmessagetype, seterrmessagetype] = useState('');
    const [errmessage, seterrmessage] = useState('');
    const [show, setShow] = useState(false);
    const navigate = useNavigate();



    useEffect(() => {

        MaindevicesData();

    }, []);


    useEffect(() => {
        const result = devices.filter((dtype) => {
            return dtype.devicetype.toLowerCase().match(search.toLowerCase());
        });
        search != '' ? setDevices(result) : MaindevicesData()
    }, [search]);

    const MaindevicesData = () => {
        setisloading(true);
        GetDevices()
            .then(res => {
                if (res) {
                    setisloading(false)
                    setDevices(res);
                }
                else {
                    alert("Invalid Credentials");
                }

            })
    }

    const showAddModel = () => {
        seteditdata({})
        setaddModalShow(true);
    }
    const showDeleteModal = (item) => {
        setselectedid(item);
        setdelModalShow(true);


    }


    const OnDeleteForm = (devicetypeid) => {
        DeleteDeviceType(devicetypeid).then((res) => {
            console.log(res.msg)
            console.log(res)
            if (res.msg === "Deleted") {

                setAlert(true);
                setShow(false);

                seterrmessagetype('success');
                seterrmessage('Data Deleted successfully');
                setdelModalShow(false);
                MaindevicesData();
            }
            else {
                setAlert(true);
                setShow(false);

                seterrmessagetype('danger');
                seterrmessage('Something went wrong, Please try again...');
                setdelModalShow(false);
                MaindevicesData();
                setdelModalShow(false);
            }

        })
    }

    const onSubmitForm = (devicetypeid) => {
        // setisloading(true);
        AddDeviceType(devicetypeid).then((res) => {
            // setisloading(false);

            if (res.msg === "Saved") {
                setaddModalShow(false);
                setShow(false);
                setAlert(true);
                seterrmessagetype('success');
                seterrmessage('Data Inserted successfuly');
                MaindevicesData();
            }
            else {
                setaddModalShow(false);
                setShow(false);
                setAlert(true);
                seterrmessagetype('failed');
                seterrmessage('Something went wrong!, Please try again..');
                MaindevicesData();
            }
        })
    }
    const OnEditForm = (body) => {
        UpdateDeviceType(body).then((res) => {
            if (res.msg === "Saved") {
                setShow(false);
                setAlert(true);
                seterrmessagetype('success');
                seterrmessage('Data Updated successfuly');
                seteditmodalshow(false);
                MaindevicesData();
            }

            else {
                seteditmodalshow(false);
                setShow(false);
                setAlert(true);
                seterrmessagetype('failed');
                seterrmessage('Something went wrong!, Please try again..');
                MaindevicesData();
            }

        })
    }
    const showEditModel = (item) => {
        console.log(item);
        seteditdata(item);
        seteditmodalshow(true);

    }
    const column = [
        {
            name: "Device Type ID",
            selector: (row) => row.devicetypeid,
            sortable: true
        },
        {
            name: "Device Type",
            selector: (row) => row.devicetype,
            sortable: true
        },
        {
            name: "Action",
            selector: (row) => <div className='row'> <div className="col-md-6" onClick={() => showEditModel(row)}><i className='fa fa-edit'></i></div> <div className="col-md-6" onClick={() => showDeleteModal(row.devicetypeid)}><i className='fa fa-trash '></i></div></div>,
            sortable: true
        },
        // <button onClick={() => goToDeviceData} style={{ padding: "4px", borderRadius: "5px", border: "1px solid green", boxShadow: " 0 0 2px #000", }} > View</button >,

    ]




    // const maindevices=(devicetype)=>{
    //     AddDeviceType(devicetype)
    //         .then(res=>{
    //             if(res){
    //                 setDevices(res);
    //             }
    //             else{
    //                 alert('Ivalid feild')
    //             }
    //         })

    // } 


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
                        isloading !== true ? <div className='card cdn1223'>
                            <DataTable className='striped hover ' style={{ textAlign: "center", borderRadius: "10px" }} columns={column}
                                data={devices}
                                pagination
                                fixedHeader
                                fixedHeaderScrollHeight='500px'
                                highlightOnHover
                                subHeader
                                sear
                                subHeaderComponent={

                                    <div>
                                        <input type="search" placeholder='Search Here' value={search} onChange={(e) => setsearch(e.target.value)} className='w-25 form-control search-c' />

                                        <div>
                                            <button onClick={() => showAddModel()} style={{ float: "left", marginRight: "10px", padding: "6px", borderRadius: "5px", border: "2px solid transparent", boxShadow: " 0 0 2px #000", backgroundColor: "white" }}>Add Device Type</button>
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
            show={editmodalshow}
            onHide={() => seteditmodalshow(false)}
            onSubmitForm={OnEditForm}
            edidata={editdata}
        />
        <Deleterecord
            show={delmodalshow}
            onhide={() => setdelModalShow(false)}
            deleteid={selectedid}
            deletedata={OnDeleteForm}
        />

    </div>
};

function AddModal(props1) {

    const { show, onHide, onSubmitForm, edidata } = props1;
    const [devicetypeid, setdevicetypeid] = useState('');
    var edidatalenth = Object.keys(edidata).length;
    const SubmitForm = () => {
        onSubmitForm(devicetypeid);
        setdevicetypeid('')
    }

    return (
        <Modal
            show={props1.show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            closeButton
        >
            <Modal.Header >
                <div className=' modal-title' id="contained-modal-title-vcenter">
                    <h6 className=''>Add Device Type</h6>
                </div>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="row">
                        <div className="col-md-12">

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Device Type Name</Form.Label>
                                <Form.Control type="text" name='dtype' value={devicetypeid} onChange={(e) => setdevicetypeid(e.target.value)} placeholder="Enter Device Name" />

                            </Form.Group>

                        </div>

                    </div>

                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Close</Button>
                <Button onClick={SubmitForm}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}
function EditModal(props1) {

    const { show, onHide, onSubmitForm, edidata } = props1;
    const [devicetypeid, setdevicetypeid] = useState('');
    var edidatalenth = Object.keys(edidata).length;

    useEffect(() => {
        if (show === true && edidatalenth !== 0) {
            console.log(edidata.devicetype);
            // debugger;
            var devicetypename = document.getElementsByName('dtype')[0];


            devicetypename.value = edidata.devicetype;

            // setdevicetypeid(edidata.devicetype)
        }
    })
    const OnEditSubmit = () => {
        const body = {
            devicetypeid: edidata.devicetypeid,
            devicetype: devicetypeid
        }
        onSubmitForm(body);
        setdevicetypeid('')
        console.log(body)
    }
    return (
        <Modal
            show={props1.show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            closeButton
        >
            <Modal.Header >
                <div className=' modal-title' id="contained-modal-title-vcenter">
                    <h6 className=''>Add Device Type</h6>
                </div>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="row">
                        <div className="col-md-12">

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Device Type Name</Form.Label>
                                <Form.Control type="text" name='dtype' value={devicetypeid} onChange={(e) => setdevicetypeid(e.target.value)} placeholder="Enter Device Name" />

                            </Form.Group>

                        </div>

                    </div>

                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Close</Button>
                <Button onClick={OnEditSubmit}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}
function Deleterecord(props) {
    const { show, onhide, deletedata, deleteid } = props;
    const [deletemodel, setDeletemodel] = useState(false);


    const deleteRecordData = () => {
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
                    <Modal.Title>Delete Device Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are You sure ? You want to delete Device.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onhide}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={deleteRecordData}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
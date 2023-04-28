import { useLocation, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { AddDeviceNode, DeleteDeviceNode, DeleteDeviceType, GetDeviceNode, GetDevices, RenameDeviceNode } from '../api';
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


export default function DeviceNode() {
    const [addmodalShow, setaddModalShow] = useState(false);
    const [delmodalshow, setdelModalShow] = useState(false);
    const [editdata, seteditdata] = useState({})
    const [isloading, setisloading] = useState(false);
    const [selectedid, setselectedid] = useState('');
    const [alert, setAlert] = useState(false);
    const [errmessagetype, seterrmessagetype] = useState('');
    const [errmessage, seterrmessage] = useState('');
    const [show, setShow] = useState(false);
    const search = useLocation().search;
    const [editmodalshow, seteditmdalshow] = useState(false);
    const deviceid = new URLSearchParams(search).get('deviceId');


    useEffect(() => {

        DeviceNodeData();

    }, []);

    const DeviceNodeData = () => {

        console.log(deviceid);
        setisloading(true);
        GetDeviceNode(deviceid)
            .then(res => {
                if (res) {
                    console.log(res);
                    setisloading(false)
                    setDevices(res);
                }
                else {
                    alert("Invalid Credentials");
                }

            })
    }

    const showAddModel = () => {
        setaddModalShow(true);
    }
    const showDeleteModal = (item) => {
        setselectedid(item);
        setdelModalShow(true);


    }


    const OnDeleteForm = (devicetypeid) => {
        DeleteDeviceNode(devicetypeid).then((res) => {
            console.log(res.msg)
            console.log(res)
            if (res.msg === "Deleted") {
                console.log("dn")
                setdelModalShow(false);
                DeviceNodeData();
                setShow(false);
                setAlert(true);
                seterrmessagetype('success');
                seterrmessage('Data Deleted successfuly');
            }
            else {
                setShow(false);
                setAlert(true);
                seterrmessagetype('failed');
                seterrmessage('Something went wrong!, Please try again..');
                setdelModalShow(false);
            }

        })
    }

    const onSubmitForm = (devicetypeid) => {
        const data = {
            nodename: devicetypeid,
            deviceid: deviceid
        }
        // setisloading(true);
        debugger;
        AddDeviceNode(data).then((res) => {
            if (res.msg === "Saved") {
                setShow(false);
                setAlert(true);
                seterrmessagetype('success');
                seterrmessage('Data Inserted successfuly');
                setaddModalShow(false);
                DeviceNodeData();
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
    const onEditSubmitForm = (body) => {
        console.log(body);
        // setisloading(true);
        RenameDeviceNode(body).then((res) => {
            console.log(res);
            if (res.msg === "Saved") {
                setShow(false);
                setAlert(true);
                seterrmessagetype('success');
                seterrmessage('Data Updated successfuly');
                setaddModalShow(false);
                DeviceNodeData();
            }
            else {
                setShow(false);
                setAlert(true);
                seterrmessagetype('failed');
                setaddModalShow(false);
                seterrmessage('Something went wrong!, Please try again..');
            }
        })
    }
    const showEditModel = (item) => {
        console.log(item);
        seteditdata(item);
        seteditmdalshow(true);

    }
    const column = [
        {
            name: "Device ID",
            selector: (row) => row.deviceid,
            sortable: true
        },
        {
            name: "Node ID",
            selector: (row) => row.nodeid,
            sortable: true
        },
        {
            name: "Node Name",
            selector: (row) => row.nodename,
            sortable: true
        },
        {
            name: "Node PIC",
            selector: (row) => row.nodepic,
            sortable: true
        },
        {
            name: "Action",
            selector: (row) => <div className='row'> <div className="col-md-6" onClick={() => showEditModel(row)}><i className='fa fa-edit'></i></div> <div className="col-md-6" onClick={() => showDeleteModal(row.nodeid)}><i className='fa fa-trash '></i></div></div>,
            sortable: true
        },
        // <button onClick={() => goToDeviceData} style={{ padding: "4px", borderRadius: "5px", border: "1px solid green", boxShadow: " 0 0 2px #000", }} > View</button >,

    ]
    const [devices, setDevices] = useState([]);
    const navigate = useNavigate();



    // const DeviceNode=(devicetype)=>{
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
                                subHeaderComponent={

                                    <div>
                                        <input type="text" placeholder='Search Here' className='w-25 form-control search-c' />
                                        <div>
                                            <button onClick={() => showAddModel()} style={{ float: "left", marginRight: "10px", padding: "6px", borderRadius: "5px", border: "2px solid transparent", boxShadow: " 0 0 2px #000", backgroundColor: "white" }}>Add Device Node</button>

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
        <EditModal
            show={editmodalshow}
            onHide={() => seteditmdalshow(false)}
            onSubmitForm={onEditSubmitForm}
            edidata={editdata}
        />
        <AddModel
            show={addmodalShow}
            onHide={() => setaddModalShow(false)}
            onSubmitForm={onSubmitForm}
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

function AddModel(props1) {

    const { show, onHide, onSubmitForm, edidata } = props1;
    const [devicetypeid, setdevicetypeid] = useState('');
    var edidatalenth = Object.keys(edidata).length;


    const OnEditSubmit = () => {

        onSubmitForm(devicetypeid);


    }
    return (
        <Modal
            show={props1.show}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            closeButton
        >
            <Modal.Header >
                <div className=' modal-title' id="contained-modal-title-vcenter">
                    <h6 className=''>Add Device Node</h6>
                </div>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="row">
                        <div className="col-md-12">

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Device Node Name</Form.Label>
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
function EditModal(props1) {

    const { show, onHide, onSubmitForm, edidata } = props1;
    const [devicetypeid, setdevicetypeid] = useState('');
    var edidatalenth = Object.keys(edidata).length;
    const SubmitForm = () => {

    }
    useEffect(() => {
        if (show === true && edidatalenth !== 0) {
            console.log(edidata.nodename);
            // debugger;
            var devicetypename = document.getElementsByName('dtype')[0];

            devicetypename.value = edidata.nodename

            // setdevicetypeid(edidata.devicetype)
        }
    })
    const OnEditSubmit = () => {
        const body = {
            nodeid: edidata.nodeid,
            nodename: devicetypeid
        }
        onSubmitForm(body);
        console.log(body)
    }
    return (
        <Modal
            show={props1.show}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            closeButton
        >
            <Modal.Header >
                <div className=' modal-title' id="contained-modal-title-vcenter">
                    <h6 className=''>Add Device Node</h6>
                </div>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="row">
                        <div className="col-md-12">

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Device Node Name</Form.Label>
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
                    <Modal.Title>Delete Divice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are You sure ? You want to delete Device Node.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onhide}>
                        Close
                    </Button>
                    <Button variant="success" onClick={deleteRecordData}>Understood</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
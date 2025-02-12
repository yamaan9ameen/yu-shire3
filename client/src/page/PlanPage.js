import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  ListGroup,
  Row,
  Col,
  Card,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import axios from "axios";
import "../css/PlanPage.css";

const PlanPage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [hours, setHours] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [suggestedPlan, setSuggestedPlan] = useState([]);
  const [activePopover, setActivePopover] = useState(null); // حالة لتتبع النافذة المفتوحة
  const [selectedMaterialDetails, setSelectedMaterialDetails] = useState(null); // حالة لتخزين تفاصيل المادة المحددة

  React.useEffect(() => {
    axios
      .get(`https://sharia-yu.onrender.com/departments/${name}`)
      .then((response) => {
        setDepartment(response.data);
      })
      .catch((error) => {
        console.error("Error fetching department details:", error);
      });
  }, [name]);

  const handleMaterialSelection = (materialId) => {
    if (selectedMaterials.includes(materialId)) {
      setSelectedMaterials(selectedMaterials.filter((id) => id !== materialId));
    } else {
      setSelectedMaterials([...selectedMaterials, materialId]);
    }
  };

  const handleGeneratePlan = async () => {
    try {
      const response = await axios.post(
        `https://sharia-yu.onrender.com/departments/${name}/plan`,
        {
          year,
          semester,
          hours,
          selectedMaterials,
        }
      );
      setSuggestedPlan(response.data);
    } catch (error) {
      console.error("Error generating plan:", error);
    }
  };

  const handlePopoverToggle = (popoverId) => {
    if (activePopover === popoverId) {
      setActivePopover(null); // إغلاق النافذة إذا كانت مفتوحة بالفعل
    } else {
      setActivePopover(popoverId); // فتح النافذة الجديدة
    }
  };

  const handleMaterialClick = (material) => {
    setSelectedMaterialDetails(material); // حفظ تفاصيل المادة المحددة
  };

  if (!department) {
    return <div>جاري التحميل...</div>;
  }

  // تصنيف المواد لعرضها في واجهة المستخدم
  const electiveUniversity = department.materials.filter(
    (m) => m.type === "electiveUniversity"
  );
  const mandatoryCollege = department.materials.filter(
    (m) => m.type === "mandatoryCollege"
  );
  const electiveDepartment = department.materials.filter(
    (m) => m.type === "electiveDepartment"
  );
  const mandatoryUniversity = department.materials.filter(
    (m) => m.type === "mandatoryUniversity"
  );

  // دالة لإنشاء نافذة منبثقة مع زر إغلاق
  const createPopover = (title, materials, popoverId) => (
    <Popover id={`popover-${popoverId}`} className="custom-popover">
      <Popover.Header as="h3" className="popover-header-custom">
        <Button
          onClick={() => handlePopoverToggle(popoverId)}
          className="close-popover-button"
        >
          &times;
        </Button> 
        <br></br>
        <span style={{ marginLeft: "40px" }}>{title}</span>{" "}
        {/* إضافة مسافة لتعويض وجود الزر */}
      </Popover.Header>
      <Popover.Body className="popover-body-custom">
        <div className="materials-grid">
          {materials.map((material) => (
            <Card key={material._id} className="custom-card">
              <Card.Body>
                <Form.Check
                  type="checkbox"
                  id={material._id}
                  label={`${material.name}`}
                  onChange={() => handleMaterialSelection(material._id)}
                  className="custom-checkbox"
                />
              </Card.Body>
            </Card>
          ))}
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <Container className="plan-page">
      <h1 className="text-center">الخطة الفصلية: {department.name}</h1>
      <Form>
        <Row className="mb-3">
          <Col>
            <Form.Label>السنة</Form.Label>
            <Form.Control
              as="select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="custom-select"
            >
              <option value="">اختر السنة</option>
              <option value="1">الأولى</option>
              <option value="2">الثانية</option>
              <option value="3">الثالثة</option>
              <option value="4">الرابعة</option>
            </Form.Control>
          </Col>
          <Col>
            <Form.Label>الفصل</Form.Label>
            <Form.Control
              as="select"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="custom-select"
            >
              <option value="">اختر الفصل</option>
              <option value="1">الأول</option>
              <option value="2">الثاني</option>
            </Form.Control>
          </Col>
          <Col>
            <Form.Label>عدد الساعات</Form.Label>
            <Form.Control
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="custom-input"
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <OverlayTrigger
              trigger="click"
              placement="bottom"
              show={activePopover === "electiveUniversity"}
              onToggle={() => handlePopoverToggle("electiveUniversity")}
              overlay={createPopover(
                "اختر مواد اختياري جامعة",
                electiveUniversity,
                "electiveUniversity"
              )}
            >
              <Button variant="outline-primary" className="custom-button">
                📚 اختر مواد اختياري جامعة
              </Button>
            </OverlayTrigger>
          </Col>
          <Col>
            <OverlayTrigger
              trigger="click"
              placement="bottom"
              show={activePopover === "mandatoryCollege"}
              onToggle={() => handlePopoverToggle("mandatoryCollege")}
              overlay={createPopover(
                "اختر مواد إجباري كلية",
                mandatoryCollege,
                "mandatoryCollege"
              )}
            >
              <Button variant="outline-primary" className="custom-button">
                🏛️ اختر مواد إجباري كلية
              </Button>
            </OverlayTrigger>
          </Col>
          <Col>
            <OverlayTrigger
              trigger="click"
              placement="bottom"
              show={activePopover === "electiveDepartment"}
              onToggle={() => handlePopoverToggle("electiveDepartment")}
              overlay={createPopover(
                "اختر مواد اختياري قسم",
                electiveDepartment,
                "electiveDepartment"
              )}
            >
              <Button variant="outline-primary" className="custom-button">
                📖 اختر مواد اختياري قسم
              </Button>
            </OverlayTrigger>
          </Col>
          <Col>
            <OverlayTrigger
              trigger="click"
              placement="bottom"
              show={activePopover === "mandatoryUniversity"}
              onToggle={() => handlePopoverToggle("mandatoryUniversity")}
              overlay={createPopover(
                "اختر مواد إجباري جامعة",
                mandatoryUniversity,
                "mandatoryUniversity"
              )}
            >
              <Button variant="outline-primary" className="custom-button">
                🎓 اختر مواد إجباري جامعة
              </Button>
            </OverlayTrigger>
          </Col>
        </Row>
        <Button
          variant="primary"
          onClick={handleGeneratePlan}
          className="generate-plan-button"
        >
          إنشاء الخطة
        </Button>
      </Form>
      {suggestedPlan.length > 0 && (
        <div className="mt-3">
          <h5>الخطة المقترحة:</h5>
          <ListGroup className="custom-list-group">
            {suggestedPlan.map((material, index) => (
              <ListGroup.Item
                key={index}
                className="custom-list-item"
                onClick={() => handleMaterialClick(material)}
              >
                <strong>{material.name}</strong>: {material.description} (
                {material.type})
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
      {selectedMaterialDetails && (
        <div className="material-details">
          <h5>تفاصيل المادة المحددة:</h5>
          <Card>
            <Card.Body>
              <Card.Title>{selectedMaterialDetails.name}</Card.Title>
              <Card.Text>
                <div className="detail-item">
                  <strong>الوصف:</strong> {selectedMaterialDetails.description}
                </div>
                <div className="detail-item">
                  <strong>النوع:</strong> {selectedMaterialDetails.type}
                </div>
                <div className="detail-item">
                  <strong>عدد الساعات:</strong> {selectedMaterialDetails.hours}
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      )}
      <Button
        variant="secondary"
        onClick={() => navigate(-1)}
        className="back-button"
      >
     → العودة 
      </Button>
    </Container>
  );
};

export default PlanPage;

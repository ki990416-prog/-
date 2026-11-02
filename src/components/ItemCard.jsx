import { Badge, Button, Card } from 'react-bootstrap'

// 관광지·유산·즐겨찾기 등 "목록의 한 칸"을 모두 이 카드 하나로 표시합니다 (재사용 컴포넌트)
// image 가 없으면 placeholder 아이콘을 보여주고, onOpen 이 있으면 카드를 눌러 상세를 열 수 있어요
export default function ItemCard({ title, subtitle, image, badge, onSave, onOpen, placeholder = 'image' }) {
  const open = onOpen && {
    role: 'button', tabIndex: 0, onClick: onOpen,
    onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen() } },
    style: { cursor: 'pointer' },
  }
  return (
    <Card className="h-100 item-card" {...open}>
      {image
        ? <Card.Img variant="top" src={image} alt={title} className="item-card-img" />
        : <div className="item-card-img placeholder-img"><i className={`bi bi-${placeholder}`} /></div>}
      <Card.Body className="d-flex flex-column">
        {badge && <Badge bg="secondary" className="align-self-start mb-2">{badge}</Badge>}
        <Card.Title className="fs-6 fw-bold">{title}</Card.Title>
        {subtitle && <Card.Text className="small text-muted">{subtitle}</Card.Text>}
        {onSave && (
          <Button size="sm" variant="outline-primary" className="mt-auto"
            onClick={(e) => { e.stopPropagation(); onSave() }}>
            <i className="bi bi-star me-1" />즐겨찾기
          </Button>
        )}
      </Card.Body>
    </Card>
  )
}

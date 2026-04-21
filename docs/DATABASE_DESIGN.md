# Database Design — Smart Warehouse
**Author:** Misha Andalusia (001202400040)

## Overview
This document describes the database schema for the Smart Warehouse
Bio-Hazard & Pest Detection system at PT. Kawan Lama.

---

## Tables

### 1. users
| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR | Primary key |
| name | VARCHAR | Full name |
| email | VARCHAR | Login email |
| role | ENUM | admin / manager / operator |
| student_id | VARCHAR | University student ID |

### 2. zones
| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR | Primary key |
| name | VARCHAR | Zone name |
| capacity | INT | Max capacity |
| used | INT | Current usage |
| status | ENUM | active / warning / inactive |
| risk_level | ENUM | low / medium / high |

### 3. cameras
| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR | Primary key |
| name | VARCHAR | Camera label |
| zone_id | VARCHAR | Foreign key → zones |
| status | ENUM | online / offline |
| resolution | VARCHAR | e.g. 1920x1080 |
| fps | INT | Frames per second |

### 4. detections
| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR | Primary key |
| camera_id | VARCHAR | Foreign key → cameras |
| object_class | VARCHAR | Detected object type |
| confidence | FLOAT | Detection confidence score |
| zone_id | VARCHAR | Foreign key → zones |
| detected_at | DATETIME | Timestamp |

### 5. inventory
| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR | Primary key |
| name | VARCHAR | Item name |
| category | VARCHAR | Item category |
| zone_id | VARCHAR | Foreign key → zones |
| quantity | INT | Current stock |
| min_stock | INT | Minimum threshold |
| status | ENUM | in-stock / low-stock / out-of-stock |
| last_detected | DATETIME | Last detection time |

### 6. alerts
| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR | Primary key |
| type | ENUM | critical / warning / info |
| title | VARCHAR | Alert title |
| message | TEXT | Alert detail |
| zone_id | VARCHAR | Foreign key → zones |
| is_read | BOOLEAN | Read status |
| created_at | DATETIME | Timestamp |

### 7. activity_log
| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR | Primary key |
| user_id | VARCHAR | Foreign key → users |
| action | VARCHAR | Action description |
| target | VARCHAR | Affected item/entity |
| type | ENUM | create/update/delete/detection/alert |
| created_at | DATETIME | Timestamp |

---

## Entity Relationships
- cameras → zones (many-to-one)
- detections → cameras (many-to-one)
- detections → zones (many-to-one)
- inventory → zones (many-to-one)
- alerts → zones (many-to-one)
- activity_log → users (many-to-one)
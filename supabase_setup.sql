-- 1. Inventory items
CREATE TABLE inventory (
    id            BIGSERIAL PRIMARY KEY,
    name          TEXT      NOT NULL,
    control_id    TEXT      NOT NULL,
    quantity      INTEGER   NOT NULL CHECK (quantity >= 0),
    status        TEXT      NOT NULL CHECK (status IN ('available','used','broken')),
    type          TEXT      NOT NULL CHECK (type IN ('metal','consumable','sensors','motors','electronics')),
    created_at    TIMESTAMPTZ DEFAULT now()
);

-- 2. Team members
CREATE TABLE team_members (
    id        BIGSERIAL PRIMARY KEY,
    name      TEXT      NOT NULL,
    role      TEXT      NOT NULL,
    status    TEXT      NOT NULL CHECK (status IN ('online','offline','available','not-available','pending')),
    avatar    TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Events
CREATE TABLE events (
    id                BIGSERIAL PRIMARY KEY,
    title             TEXT      NOT NULL,
    event_date        DATE      NOT NULL,
    event_time        TIME      NOT NULL,
    location          TEXT      NOT NULL,
    description       TEXT,
    gather_availability BOOLEAN NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMPTZ DEFAULT now()
);

-- 4. Event attendees
CREATE TABLE event_attendees (
    id        BIGSERIAL PRIMARY KEY,
    event_id  BIGINT    NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name      TEXT      NOT NULL,
    status    TEXT      NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Activity feed
CREATE TABLE activities (
    id        BIGSERIAL PRIMARY KEY,
    user_name TEXT      NOT NULL,
    action    TEXT      NOT NULL,
    item      TEXT,
    avatar    TEXT,
    time      TIMESTAMPTZ NOT NULL DEFAULT now()
);

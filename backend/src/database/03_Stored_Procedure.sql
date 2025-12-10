select * from employee
select * from branch
select * from transfer_history
select * from membership_tier
select * from customer
select * from pet
select * from branch_service
select * from appointment
select * from appointment_service
select * from product
delete from branch_service


-- Appointment
CREATE OR REPLACE FUNCTION fnc_insert_appointment(
    p_customer_id      INTEGER,
    p_pet_id           INTEGER,
    p_branch_id        INTEGER,
    p_employee_id      INTEGER,
    p_appointment_time TIMESTAMP,
    p_status           VARCHAR,
    p_channel          VARCHAR
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_appointment_id INTEGER;
    v_pet_customer_id INTEGER;
BEGIN
    -- Kiểm tra status hợp lệ
    IF p_status NOT IN ('Pending','Confirmed','Completed','Cancelled') THEN
        RAISE EXCEPTION 'Invalid status: %', p_status;
    END IF;

    -- Kiểm tra channel hợp lệ
    IF p_channel NOT IN ('Online','Offline') THEN
        RAISE EXCEPTION 'Invalid channel: %', p_channel;
    END IF;

    -- Kiểm tra pet có thuộc customer
    SELECT customer_id INTO v_pet_customer_id
    FROM pet
    WHERE pet_id = p_pet_id;

    IF v_pet_customer_id IS NULL THEN
        RAISE EXCEPTION 'Pet ID % does not exist', p_pet_id;
    ELSIF v_pet_customer_id <> p_customer_id THEN
        RAISE EXCEPTION 'Pet ID % does not belong to Customer ID %', p_pet_id, p_customer_id;
    END IF;

    -- Chèn bản ghi vào bảng appointment
    INSERT INTO appointment (
        customer_id, pet_id, branch_id, employee_id, appointment_time, status, channel
    )
    VALUES (
        p_customer_id, p_pet_id, p_branch_id, p_employee_id, p_appointment_time, p_status, p_channel
    )
    RETURNING appointment_id INTO v_appointment_id;

    RETURN v_appointment_id;
END;
$$;
drop function fnc_get_appointments

CREATE OR REPLACE FUNCTION fnc_get_appointments()
RETURNS TABLE(
	appointment_id INTEGER,
    customer_name VARCHAR,
    customer_phone VARCHAR,
    pet_name VARCHAR,
    branch_name VARCHAR,
    employee_name VARCHAR,
    appointment_status VARCHAR,
    appointment_time TIMESTAMP,
    appointment_channel VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
		a.appointment_id,
        c.full_name AS customer_name,
        c.phone AS customer_phone,
        p.pet_name AS pet_name,
        b.name AS branch_name,
        e.full_name AS employee_name,
        a.status AS appointment_status,
        a.appointment_time AS appointment_time,
        a.channel AS appointment_channel
    FROM 
        appointment a
    JOIN 
        customer c ON a.customer_id = c.customer_id
    JOIN 
        pet p ON a.pet_id = p.pet_id
    JOIN 
        branch b ON a.branch_id = b.branch_id
    JOIN 
        employee e ON a.employee_id = e.employee_id;
END;
$$ LANGUAGE plpgsql;

drop function fnc_update_appointment_status
CREATE OR REPLACE FUNCTION fnc_update_appointment_status(
    v_appointment_id INT,
    v_status VARCHAR
)
RETURNS VOID AS $$
BEGIN
    -- Kiểm tra trạng thái hợp lệ
    IF v_status NOT IN ('Pending', 'Confirmed', 'Completed', 'Cancelled') THEN
        RAISE EXCEPTION 
            'Invalid status: %. Allowed: Pending, Confirmed, Completed, Cancelled', 
            v_status;
    END IF;

    -- Kiểm tra cuộc hẹn tồn tại
    IF NOT EXISTS (
        SELECT 1 
        FROM appointment a 
        WHERE a.appointment_id = v_appointment_id
    ) THEN
        RAISE EXCEPTION 
            'Appointment ID % does not exist', 
            v_appointment_id;
    END IF;

    -- Update trạng thái
    UPDATE appointment
    SET status = v_status
    WHERE appointment_id = v_appointment_id;

END;
$$ LANGUAGE plpgsql;

select * from pet 

CREATE OR REPLACE FUNCTION fnc_get_services_by_appointment(
    p_appointment_id INTEGER
)
RETURNS TABLE (
    service_id   INTEGER,
    service_name VARCHAR,
    service_type VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.service_id,
        s.service_name,
        s.service_type
    FROM appointment_service aps
    JOIN service s ON s.service_id = thêm aps.service_id
    WHERE aps.appointment_id = p_appointment_id;

END;
$$;

CREATE OR REPLACE FUNCTION fnc_add_service_to_appointment(
    p_appointment_id INTEGER,
    p_service_id     INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_branch_id INTEGER;
    v_exists INTEGER;
BEGIN
    ----------------------------------------------------------------------
    -- 1. Lấy branch của appointment
    ----------------------------------------------------------------------
    SELECT a.branch_id
    INTO v_branch_id
    FROM appointment AS a
    WHERE a.appointment_id = p_appointment_id;

    IF v_branch_id IS NULL THEN
        RAISE EXCEPTION 'Appointment ID % does not exist', p_appointment_id;
    END IF;

    ----------------------------------------------------------------------
    -- 2. Kiểm tra service có tồn tại
    ----------------------------------------------------------------------
    PERFORM 1
    FROM service AS s
    WHERE s.service_id = p_service_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Service ID % does not exist', p_service_id;
    END IF;

    ----------------------------------------------------------------------
    -- 3. Kiểm tra service có sẵn tại chi nhánh
    ----------------------------------------------------------------------
    PERFORM 1
    FROM branch_service AS bs
    WHERE bs.branch_id = v_branch_id
      AND bs.service_id = p_service_id
      AND bs.is_available = TRUE;

    IF NOT FOUND THEN
        RAISE EXCEPTION
            'Service ID % is not available at Branch ID %',
            p_service_id, v_branch_id;
    END IF;

    ----------------------------------------------------------------------
    -- 4. Kiểm tra service đã có trong appointment chưa
    ----------------------------------------------------------------------
    SELECT 1 INTO v_exists
    FROM appointment_service AS aps
    WHERE aps.appointment_id = p_appointment_id
      AND aps.service_id = p_service_id;

    IF v_exists = 1 THEN
        RAISE EXCEPTION
            'Service ID % already exists in Appointment ID %',
            p_service_id, p_appointment_id;
    END IF;

    ----------------------------------------------------------------------
    -- 5. Thêm vào appointment_service
    ----------------------------------------------------------------------
    INSERT INTO appointment_service AS aps (appointment_id, service_id)
    VALUES (p_appointment_id, p_service_id);

END;
$$;


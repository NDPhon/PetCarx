select * from employee
select * from branch
select * from transfer_history
select * from membership_tier
select * from customer
select * from pet
select * from branch_service
select * from appointment
select * from appointment_service
delete from branch_service

CREATE OR REPLACE FUNCTION fnc_insert_appointment(
    p_customer_id      INTEGER,
    p_pet_id           INTEGER,
    p_branch_id        INTEGER,
    p_employee_id      INTEGER,
    p_appointment_time TIMESTAMP,
    p_status           VARCHAR,
    p_channel          VARCHAR,
    p_service_ids      INTEGER[]  -- danh sách service_id muốn sử dụng
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_appointment_id INTEGER;
    v_pet_customer_id INTEGER;
    v_invalid_service INTEGER;
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

    -- Kiểm tra service có tồn tại tại branch và is_available = TRUE
    SELECT s_id
    INTO v_invalid_service
    FROM unnest(p_service_ids) AS s_id
    LEFT JOIN branch_service bs 
           ON bs.branch_id = p_branch_id AND bs.service_id = s_id
    WHERE bs.service_id IS NULL OR bs.is_available = FALSE
    LIMIT 1;

    IF v_invalid_service IS NOT NULL THEN
        RAISE EXCEPTION 'Service ID % is not available at Branch ID %', v_invalid_service, p_branch_id;
    END IF;

    -- Chèn bản ghi vào bảng appointment
    INSERT INTO appointment (
        customer_id, pet_id, branch_id, employee_id, appointment_time, status, channel
    )
    VALUES (
        p_customer_id, p_pet_id, p_branch_id, p_employee_id, p_appointment_time, p_status, p_channel
    )
    RETURNING appointment_id INTO v_appointment_id;

    -- Chèn các service vào appointment_service
    INSERT INTO appointment_service (appointment_id, service_id)
    SELECT v_appointment_id, unnest(p_service_ids);

    RETURN v_appointment_id;
END;
$$;


SELECT fnc_insert_appointment(
    1,                       -- customer_id
    2,                       -- pet_id
    1,                       -- branch_id
    3,                       -- employee_id
    '2025-12-07 10:00:00',   -- appointment_time
    'Pending',               -- status
    'Online',                -- channel
    ARRAY[1,2,5]             -- service_ids
);

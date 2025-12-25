select * from inventory
select * from warehouse
select * from employee
select * from branch
select * from transfer_history
select * from membership_tier
select * from customer
select * from pet
select * from appointment
select * from appointment_service
select * from service
select * from invoice
select * from employee
select * from promotion
select * from product
select * from warehouse
select * from inventory
select * from branch_service


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
select * from employee
CREATE OR REPLACE FUNCTION fnc_add_invoice(
    p_branch_id      INTEGER,
    p_customer_id    INTEGER,
    p_employee_id    INTEGER,
    p_promotion_id   INTEGER,
    p_payment_status VARCHAR(20)
)
RETURNS INTEGER AS $$
DECLARE
    -- alias biến để dễ đọc code hơn
    v_branch_id      ALIAS FOR p_branch_id;
    v_customer_id    ALIAS FOR p_customer_id;
    v_employee_id    ALIAS FOR p_employee_id;
    v_promotion_id   ALIAS FOR p_promotion_id;
    v_payment_status ALIAS FOR p_payment_status;

    v_invoice_id     INTEGER;
    v_employee_branch_id INTEGER;
    v_employee_position  VARCHAR;
BEGIN
    ------------------------------------------------------------------
    -- 1) Kiểm tra employee có tồn tại và thuộc branch
    ------------------------------------------------------------------
    SELECT branch_id, position
    INTO v_employee_branch_id, v_employee_position
    FROM employee
    WHERE employee_id = v_employee_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Employee % không tồn tại', v_employee_id;
    END IF;

    IF v_employee_branch_id <> v_branch_id THEN
        RAISE EXCEPTION 'Employee % không thuộc Branch %', v_employee_id, v_branch_id;
    END IF;

    ------------------------------------------------------------------
    -- 2) Kiểm tra position là Receptionist
    ------------------------------------------------------------------
    IF v_employee_position <> 'Receptionist' THEN
        RAISE EXCEPTION 'Employee % không phải Receptionist', v_employee_id;
    END IF;

    ------------------------------------------------------------------
    -- 3) Thêm invoice
    ------------------------------------------------------------------
    INSERT INTO invoice (
        branch_id,
        customer_id,
        employee_id,
        promotion_id,
        payment_status
    )
    VALUES (
        v_branch_id,
        v_customer_id,
        v_employee_id,
        v_promotion_id,
        v_payment_status
    )
    RETURNING invoice_id INTO v_invoice_id;

    RETURN v_invoice_id;
END;
$$ LANGUAGE plpgsql;

select * from product
CREATE OR REPLACE FUNCTION fnc_add_invoice_detail(
    p_invoice_id INTEGER,
    p_item_type  VARCHAR(20),
    p_service_id INTEGER,
    p_product_id INTEGER,
    p_quantity   INTEGER
)
RETURNS VOID AS $$
DECLARE
    -- alias parameter
    v_invoice_id   ALIAS FOR p_invoice_id;
    v_item_type    ALIAS FOR p_item_type;
    v_service_id   ALIAS FOR p_service_id;
    v_product_id   ALIAS FOR p_product_id;
    v_quantity     ALIAS FOR p_quantity;

    -- local variables
    v_branch_id    INTEGER;
    v_stock        INTEGER := 0;
    v_line_no      INTEGER;
    v_unit_price   NUMERIC(18,2);
    v_line_total   NUMERIC(18,2);
    v_service_available BOOLEAN;
    v_payment_status VARCHAR(20);
BEGIN
    ------------------------------------------------------------------
    -- 1) Lấy branch_id và payment_status từ invoice
    ------------------------------------------------------------------
    SELECT branch_id, payment_status
    INTO v_branch_id, v_payment_status
    FROM invoice
    WHERE invoice_id = v_invoice_id;

    IF v_branch_id IS NULL THEN
        RAISE EXCEPTION 'Invoice % không tồn tại', v_invoice_id;
    END IF;

    -- Kiểm tra trạng thái hóa đơn
    IF v_payment_status <> 'Pending' THEN
        RAISE EXCEPTION 'Chỉ được thêm sản phẩm/dịch vụ khi invoice ở trạng thái Pending, hiện tại = %', v_payment_status;
    END IF;

    ------------------------------------------------------------------
    -- 2) Kiểm tra logic service/product
    ------------------------------------------------------------------
    IF v_item_type = 'Service' THEN
        IF v_product_id IS NOT NULL THEN
            RAISE EXCEPTION 'Service không được đi kèm product_id';
        END IF;

        -- Kiểm tra service có thuộc branch không
        SELECT bs.is_available
        INTO v_service_available
        FROM branch_service bs
        WHERE bs.branch_id = v_branch_id
          AND bs.service_id = v_service_id;

        IF NOT FOUND OR v_service_available = FALSE THEN
            RAISE EXCEPTION 'Service % không khả dụng tại Branch %', v_service_id, v_branch_id;
        END IF;

        -- Lấy unit_price của service (ưu tiên price_override nếu có)
        SELECT COALESCE(bs.price_override, s.base_price)
        INTO v_unit_price
        FROM service s
        LEFT JOIN branch_service bs
          ON bs.branch_id = v_branch_id AND bs.service_id = v_service_id
        WHERE s.service_id = v_service_id;

    ELSIF v_item_type = 'Product' THEN
        IF v_service_id IS NOT NULL THEN
            RAISE EXCEPTION 'Product không được đi kèm service_id';
        END IF;

        -- Kiểm tra tồn kho
        SELECT COALESCE(SUM(inv.quantity), 0)
        INTO v_stock
        FROM inventory inv
        JOIN warehouse w ON w.warehouse_id = inv.warehouse_id
        WHERE w.branch_id = v_branch_id
          AND inv.product_id = v_product_id;

        IF v_stock < v_quantity THEN
            RAISE EXCEPTION
                'Không đủ tồn kho cho Product % tại Branch %, tồn kho = %, cần = %',
                v_product_id, v_branch_id, v_stock, v_quantity;
        END IF;

        -- Lấy unit_price từ product
        SELECT price
        INTO v_unit_price
        FROM product
        WHERE product_id = v_product_id;

    ELSE
        RAISE EXCEPTION 'item_type phải là Service hoặc Product';
    END IF;

    ------------------------------------------------------------------
    -- 3) Lấy line_no mới từ invoice_detail
    ------------------------------------------------------------------
    SELECT COALESCE(MAX(id.line_no), 0) + 1
    INTO v_line_no
    FROM invoice_detail id
    WHERE id.invoice_id = v_invoice_id;

    v_line_total := v_quantity * v_unit_price;

    ------------------------------------------------------------------
    -- 4) Thêm invoice_detail
    ------------------------------------------------------------------
    INSERT INTO invoice_detail (
        invoice_id,
        line_no,
        item_type,
        service_id,
        product_id,
        quantity,
        unit_price,
        line_total
    )
    VALUES (
        v_invoice_id,
        v_line_no,
        v_item_type,
        v_service_id,
        v_product_id,
        v_quantity,
        v_unit_price,
        v_line_total
    );

    ------------------------------------------------------------------
    -- 5) Update lại tổng invoice
    ------------------------------------------------------------------
    PERFORM fnc_update_invoice_total(v_invoice_id);

END;
$$ LANGUAGE plpgsql;


select * from invoice

CREATE OR REPLACE FUNCTION fnc_update_invoice_total(
    p_invoice_id INTEGER
)
RETURNS VOID AS $$
DECLARE
    -- alias parameter
    v_invoice_id ALIAS FOR p_invoice_id;

    -- variables
    v_total            NUMERIC(18,2);
    v_discount         NUMERIC(18,2) := 0;
    v_final            NUMERIC(18,2);
    v_promotion_value  NUMERIC(18,2);
    v_promotion_type   VARCHAR(20);
BEGIN
    ------------------------------------------------------------------
    -- 1) Tính tổng từ invoice_detail (dùng alias id)
    ------------------------------------------------------------------
    SELECT COALESCE(SUM(id.line_total), 0)
    INTO v_total
    FROM invoice_detail id
    WHERE id.invoice_id = v_invoice_id;

    ------------------------------------------------------------------
    -- 2) Lấy thông tin promotion (dùng alias i, p)
    ------------------------------------------------------------------
    SELECT 
        p.value,
        p.promotion_type
    INTO 
        v_promotion_value,
        v_promotion_type
    FROM invoice i
    LEFT JOIN promotion p 
        ON i.promotion_id = p.promotion_id
    WHERE i.invoice_id = v_invoice_id;

    ------------------------------------------------------------------
    -- 3) Tính discount
    ------------------------------------------------------------------
    IF v_promotion_type = 'Percent' THEN
        v_discount := ROUND(v_total * (v_promotion_value / 100), 2);

    ELSIF v_promotion_type = 'FixedAmount' THEN
        v_discount := v_promotion_value;

    ELSE
        -- Không có promotion
        v_discount := 0;
    END IF;

    ------------------------------------------------------------------
    -- 4) Tính final_amount
    ------------------------------------------------------------------
    v_final := v_total - v_discount;
    IF v_final < 0 THEN 
        v_final := 0; 
    END IF;

    ------------------------------------------------------------------
    -- 5) UPDATE invoice (dùng alias i)
    ------------------------------------------------------------------
    UPDATE invoice i
    SET 
        total_amount    = v_total,
        discount_amount = v_discount,
        final_amount    = v_final
    WHERE i.invoice_id = v_invoice_id;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fnc_get_invoice_list()
RETURNS TABLE(
    invoice_id      INTEGER,
    branch_id       INTEGER,
    branch_name     VARCHAR,
    customer_id     INTEGER,
    customer_name   VARCHAR,
    employee_id     INTEGER,
    employee_name   VARCHAR,
    created_at      TIMESTAMP,
    total_amount    NUMERIC(18,2),
    discount_amount NUMERIC(18,2),
    final_amount    NUMERIC(18,2),
    promotion_id    INTEGER,
    promotion_name  VARCHAR,
    promotion_type  VARCHAR,
    payment_status  VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        i.invoice_id,
        i.branch_id,
        b.name AS branch_name,
        i.customer_id,
        c.full_name AS customer_name,
        i.employee_id,
        e.full_name AS employee_name,
        i.created_at,
        i.total_amount,
        i.discount_amount,
        i.final_amount,
        i.promotion_id,
        p.promotion_name,
        p.promotion_type,
        i.payment_status
    FROM invoice i
    LEFT JOIN branch b ON i.branch_id = b.branch_id
    LEFT JOIN customer c ON i.customer_id = c.customer_id
    LEFT JOIN employee e ON i.employee_id = e.employee_id
    LEFT JOIN promotion p ON i.promotion_id = p.promotion_id
    ORDER BY i.created_at DESC;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION fnc_get_invoice_by_id(
    p_invoice_id INTEGER
)
RETURNS TABLE(
    invoice_id      INTEGER,
    branch_id       INTEGER,
    branch_name     VARCHAR,
    customer_id     INTEGER,
    customer_name   VARCHAR,
    employee_id     INTEGER,
    employee_name   VARCHAR,
    created_at      TIMESTAMP,
    total_amount    NUMERIC(18,2),
    discount_amount NUMERIC(18,2),
    final_amount    NUMERIC(18,2),
    promotion_id    INTEGER,
    promotion_name  VARCHAR,
    promotion_type  VARCHAR,
    payment_status  VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        i.invoice_id,
        i.branch_id,
        b.name AS branch_name,
        i.customer_id,
        c.full_name AS customer_name,
        i.employee_id,
        e.full_name AS employee_name,
        i.created_at,
        i.total_amount,
        i.discount_amount,
        i.final_amount,
        i.promotion_id,
        p.promotion_name,
        p.promotion_type,
        i.payment_status
    FROM invoice i
    LEFT JOIN branch b ON i.branch_id = b.branch_id
    LEFT JOIN customer c ON i.customer_id = c.customer_id
    LEFT JOIN employee e ON i.employee_id = e.employee_id
    LEFT JOIN promotion p ON i.promotion_id = p.promotion_id
    WHERE i.invoice_id = p_invoice_id;
END;
$$ LANGUAGE plpgsql;
select * from inventory where warehouse_id = 1
select * from warehouse where branch_id = 1
select * from Product where product_id = 16
CREATE OR REPLACE FUNCTION fnc_get_invoice_details(
    p_invoice_id INTEGER
)
RETURNS TABLE (
    line_no       INTEGER,
    item_type     VARCHAR,
    service_id    INTEGER,
    product_id    INTEGER,
    quantity      INTEGER,
    unit_price    NUMERIC(18,2),
    line_total    NUMERIC(18,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        id.line_no,
        id.item_type,
        id.service_id,
        id.product_id,
        id.quantity,
        id.unit_price,
        id.line_total
    FROM invoice_detail id
    WHERE id.invoice_id = p_invoice_id
    ORDER BY id.line_no;
END;
$$ LANGUAGE plpgsql;
select * from invoice

// ===================================================
//CUSTOMER
// ===================================================

CREATE OR REPLACE FUNCTION fnc_get_customer_by_phone(
    p_phone VARCHAR
)
RETURNS TABLE (
    customer_id   INTEGER,
    name          VARCHAR,
    phone         VARCHAR,
    email         VARCHAR,
    created_at    TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT c.customer_id,
           c.name,
           c.phone,
           c.email,
           c.created_at
    FROM customer c
    WHERE c.phone = p_phone;
END;
$$ LANGUAGE plpgsql;
drop function update_invoice_status
select * from 
CREATE OR REPLACE FUNCTION fnc_update_invoice_status(
    p_invoice_id INTEGER,
    p_new_status VARCHAR
)
RETURNS VARCHAR AS $$
DECLARE
    v_old_status VARCHAR;
    r_product RECORD;
    v_inventory RECORD;
    v_branch_id INTEGER;
    v_final_amount NUMERIC(18,2);
BEGIN
    -- Lấy trạng thái hiện tại, chi nhánh và số tiền cuối cùng
    SELECT payment_status, branch_id, final_amount
    INTO v_old_status, v_branch_id, v_final_amount
    FROM invoice
    WHERE invoice_id = p_invoice_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invoice ID % không tồn tại', p_invoice_id;
    END IF;

    -- Nếu trạng thái chuyển sang 'Paid'
    IF p_new_status = 'Paid' AND v_old_status <> 'Paid' THEN

        -- Trừ tồn kho cho các sản phẩm
        FOR r_product IN
            SELECT product_id, quantity
            FROM invoice_detail
            WHERE invoice_id = p_invoice_id
              AND item_type = 'Product'
        LOOP
            SELECT i.*
            INTO v_inventory
            FROM inventory i
            JOIN warehouse w ON i.warehouse_id = w.warehouse_id
            WHERE i.product_id = r_product.product_id
              AND w.branch_id = v_branch_id
              AND i.quantity >= r_product.quantity
            LIMIT 1;

            IF NOT FOUND THEN
                RAISE EXCEPTION 'Không đủ hàng trong kho chi nhánh cho sản phẩm ID %', r_product.product_id;
            END IF;

            UPDATE inventory
            SET quantity = quantity - r_product.quantity,
                update_date = CURRENT_TIMESTAMP
            WHERE inventory_id = v_inventory.inventory_id;
        END LOOP;

        -- ✅ Thêm bản ghi thanh toán
        INSERT INTO payment (
            invoice_id,
            paid_amount,
            payment_method,
            paid_at,
            status
        )
        VALUES (
            p_invoice_id,
            v_final_amount,
            'Cash',
            CURRENT_TIMESTAMP,
            'Completed'
        );
    END IF;

    -- Cập nhật trạng thái hóa đơn
    UPDATE invoice
    SET payment_status = p_new_status
    WHERE invoice_id = p_invoice_id;

    RETURN p_new_status;
END;
$$ LANGUAGE plpgsql;
select * from inventory
select * from product
insert into inventory ( quantity, warehouse_id, product_id)
values(100, 1, 1)
select * from fnc_get_all_by_branch()
CREATE OR REPLACE FUNCTION fnc_get_all_by_branch()
RETURNS TABLE (
    branch_id     INTEGER,
    branch_name   VARCHAR,
    product_id    INTEGER,
    product_name  VARCHAR,
    price         NUMERIC,
    expiry_date   DATE,
    stock_quantity INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        b.branch_id,
        b.name AS branch_name,
        p.product_id,
        p.product_name,
        p.price,
        p.expiry_date,
        COALESCE(SUM(i.quantity), 0)::INTEGER AS stock_quantity
    FROM product p
    JOIN inventory i  ON i.product_id = p.product_id
    JOIN warehouse w  ON w.warehouse_id = i.warehouse_id
    JOIN branch b     ON b.branch_id = w.branch_id
    GROUP BY
        b.branch_id,
        b.name,
        p.product_id,
        p.product_name,
        p.price,
        p.expiry_date
    ORDER BY
        b.name,
        p.product_name;
END;
$$;
drop function fnc_get_vaccine_by_branch
CREATE OR REPLACE FUNCTION fnc_get_product_by_branch(
    p_branch_id     INTEGER,
    p_product_type  VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    product_id     INTEGER,
    product_name   VARCHAR,
    price          NUMERIC,
    expiry_date    DATE,
    total_stock    INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.product_id,
        p.product_name,
        p.price,
        p.expiry_date,
        COALESCE(SUM(i.quantity), 0)::INTEGER AS total_stock
    FROM product p
    JOIN inventory i  ON i.product_id = p.product_id
    JOIN warehouse w  ON w.warehouse_id = i.warehouse_id
    WHERE w.branch_id = p_branch_id
      AND (p_product_type IS NULL OR p.product_type = p_product_type)
    GROUP BY
        p.product_id,
        p.product_name,
        p.price,
        p.expiry_date
    ORDER BY p.product_name;
END;
$$;

select * from fnc_get_product_by_branch(1, 'Vaccine')
select * from inventory
select * from warehouse
select * from product
drop function fnc_search_vaccine_by_name
CREATE OR REPLACE FUNCTION fnc_search_vaccine_by_name(
    p_keyword     VARCHAR,
	p_branch_id   INTEGER DEFAULT NULL
)
RETURNS TABLE (
    product_id     INTEGER,
    product_name   VARCHAR,
    price          NUMERIC,
    expiry_date    DATE,
    total_stock    INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.product_id,
        p.product_name,
        p.price,
        p.expiry_date,
        COALESCE(SUM(i.quantity), 0)::INTEGER AS total_stock
    FROM product p
    JOIN inventory i  ON i.product_id = p.product_id
    JOIN warehouse w  ON w.warehouse_id = i.warehouse_id
    WHERE (w.branch_id = p_branch_id OR p_branch_id IS NULL)
      AND p.product_name ILIKE '%' || p_keyword || '%'
    GROUP BY
        p.product_id,
        p.product_name,
        p.price,
        p.expiry_date
    ORDER BY p.product_name;
END;
$$;
select * from fnc_search_vaccine_by_name('Bor', 1)
CREATE OR REPLACE FUNCTION fnc_get_products_by_branch(
    p_branch_id INTEGER
)
RETURNS TABLE (
    product_id     INTEGER,
    product_name   VARCHAR,
    product_type   VARCHAR,
    unit           VARCHAR,
    price          NUMERIC,
    expiry_date    DATE,
    description    VARCHAR,
    is_active      BOOLEAN,
    total_stock    INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.product_id,
        p.product_name,
        p.product_type,
        p.unit,
        p.price,
        p.expiry_date,
        p.description,
        p.is_active,
        COALESCE(SUM(i.quantity), 0)::INTEGER AS total_stock
    FROM product p
    LEFT JOIN inventory i ON i.product_id = p.product_id
    LEFT JOIN warehouse w ON w.warehouse_id = i.warehouse_id
    WHERE w.branch_id = p_branch_id
    GROUP BY
        p.product_id,
        p.product_name,
        p.product_type,
        p.unit,
        p.price,
        p.expiry_date,
        p.description,
        p.is_active
    ORDER BY p.product_name;
END;
$$;

CREATE OR REPLACE FUNCTION fnc_total_revenue(
    p_start_date DATE,
    p_end_date   DATE
)
RETURNS NUMERIC(18,2) AS $$
DECLARE
    v_total_revenue NUMERIC(18,2);
BEGIN
    SELECT COALESCE(SUM(p.paid_amount), 0)
    INTO v_total_revenue
    FROM payment p
    WHERE p.status = 'Completed'
      AND p.paid_at >= p_start_date and p.paid_at <= p_end_date;

    RETURN v_total_revenue;
END;
$$ LANGUAGE plpgsql;

select * from fnc_total_revenue('2025-01-01', '2025-12-31')

drop function fnc_get_payments_by_date
CREATE OR REPLACE FUNCTION fnc_get_payments_by_date(
    p_start_date DATE,
    p_end_date   DATE
)
RETURNS TABLE (
    payment_id     INTEGER,
    invoice_id     INTEGER,
    branch_name    VARCHAR,
    customer_name  VARCHAR,
    paid_amount    NUMERIC(18,2),
    payment_method VARCHAR(20),
    paid_at        TIMESTAMP,
    status         VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.payment_id,
        p.invoice_id,
        b.name        AS branch_name,
        c.full_name   AS customer_name,
        p.paid_amount,
        p.payment_method,
        p.paid_at,
        p.status
    FROM payment p
    JOIN invoice  i ON p.invoice_id = i.invoice_id
    JOIN branch   b ON i.branch_id  = b.branch_id
    JOIN customer c ON i.customer_id = c.customer_id
    WHERE p.status = 'Completed'
      AND p.paid_at::DATE BETWEEN p_start_date AND p_end_date
    ORDER BY p.paid_at;
END;
$$ LANGUAGE plpgsql;

select * from fnc_revenue_by_branch(1, '2025-01-01', '2025-12-31')

CREATE OR REPLACE FUNCTION fnc_revenue_by_branch(
    p_branch_id  INTEGER,
    p_start_date DATE,
    p_end_date   DATE
)
RETURNS TABLE (
    branch_id     INTEGER,
    branch_name   VARCHAR,
    total_revenue NUMERIC(18,2),
    total_payment BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        b.branch_id,
        b.name AS branch_name,
        COALESCE(SUM(p.paid_amount), 0) AS total_revenue,
        COUNT(p.payment_id)             AS total_payment
    FROM payment p
    JOIN invoice  i ON p.invoice_id = i.invoice_id
    JOIN branch   b ON i.branch_id  = b.branch_id
    WHERE p.status = 'Completed'
      AND i.branch_id = p_branch_id
      AND p.paid_at::DATE BETWEEN p_start_date AND p_end_date
    GROUP BY b.branch_id, b.name;
END;
$$ LANGUAGE plpgsql;

select * from fnc_get_payments_by_branch(1, '2025-01-01', '2025-12-31')

CREATE OR REPLACE FUNCTION fnc_get_payments_by_branch(
    p_branch_id  INTEGER,
    p_start_date DATE,
    p_end_date   DATE
)
RETURNS TABLE (
    payment_id     INTEGER,
    invoice_id     INTEGER,
    branch_name    VARCHAR,
    customer_name  VARCHAR,
    paid_amount    NUMERIC(18,2),
    payment_method VARCHAR(20),
    paid_at        TIMESTAMP,
    status         VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.payment_id,
        p.invoice_id,
        b.name        AS branch_name,
        c.full_name   AS customer_name,
        p.paid_amount,
        p.payment_method,
        p.paid_at,
        p.status
    FROM payment p
    JOIN invoice  i ON p.invoice_id = i.invoice_id
    JOIN branch   b ON i.branch_id  = b.branch_id
    JOIN customer c ON i.customer_id = c.customer_id
    WHERE p.status = 'Completed'
      AND i.branch_id = p_branch_id
      AND p.paid_at::DATE BETWEEN p_start_date AND p_end_date
    ORDER BY p.paid_at;
END;
$$ LANGUAGE plpgsql;
drop function fnc_get_services_by_branch_id
CREATE OR REPLACE FUNCTION fnc_get_services_by_branch_id(
    p_branch_id INTEGER
)
RETURNS TABLE (
    service_id      INTEGER,
    service_name    VARCHAR,
    description     VARCHAR,
    price           NUMERIC(18,2),
    is_available    boolean
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.service_id,
        s.service_name,
        s.description,
        s.base_price,
        bs.is_available
    FROM branch_service bs
    JOIN service s 
        ON s.service_id = bs.service_id
    WHERE bs.branch_id = p_branch_id
      AND s.is_active = TRUE;
END;
$$;
select * from fnc_get_services_by_branch_id(1)
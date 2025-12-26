const fetch = global.fetch || require('node-fetch');

const BASE = 'http://localhost:8000/api';

async function getJson(url) {
  const res = await fetch(url);
  const j = await res.json().catch(() => null);
  return { status: res.status, json: j };
}

async function postJson(url, body) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await res.json().catch(() => null);
  return { status: res.status, json: j };
}

async function patchJson(url, body) {
  const res = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await res.json().catch(() => null);
  return { status: res.status, json: j };
}

async function runKB1() {
  console.log('\n=== KB1 FLOW START ===');
  // Branch list
  const branches = await getJson(`${BASE}/branches/get-branch-list`);
  console.log('Branches:', JSON.stringify(branches.json, null, 2));
  const branchId = branches?.json?.data?.[0]?.branch_id || 1;

  // Doctor list
  const doctors = await getJson(`${BASE}/employees/get-employee-doctor-list/${branchId}`);
  console.log('Doctors:', JSON.stringify(doctors.json, null, 2));
  const employeeId = doctors?.json?.data?.[0]?.employee_id || 1;

  // Services by branch
  const services = await getJson(`${BASE}/services/get-services-by-branch/${branchId}`);
  console.log('Services:', JSON.stringify(services.json, null, 2));
  const serviceId = services?.json?.data?.[0]?.service_id || 1;

  // Add customer
  const customerBody = { full_name: 'Nguyen Dang Phon', gender: 'M', date_of_birth: '2005-03-10', phone: '0123456789', email: 'hii@gmail.com', national_id: 1 };
  const addCust = await postJson(`${BASE}/customers/add-customer`, customerBody);
  console.log('Add Customer:', JSON.stringify(addCust.json, null, 2));
  const customerId = addCust?.json?.data?.customer_id || 1;

  // Lookup customer by phone
  const lookup = await getJson(`${BASE}/customers/get-customer-by-phone/${customerBody.phone}`);
  console.log('Lookup Customer:', JSON.stringify(lookup.json, null, 2));

  // Add pet
  const petBody = { name: 'Lucky', species: 'Dog', breed: 'Golden', date_of_birth: '2023-12-24', gender: 'M', health_status: 'Good', customer_id: customerId };
  const addPet = await postJson(`${BASE}/pets/add-pet`, petBody);
  console.log('Add Pet:', JSON.stringify(addPet.json, null, 2));
  const petId = addPet?.json?.data?.pet_id || null;

  // List pets
  const pets = await getJson(`${BASE}/pets/get-pets-by-customer-id/${customerId}`);
  console.log('Pets:', JSON.stringify(pets.json, null, 2));
  const chosenPetId = petId || pets?.json?.data?.[0]?.pet_id || 1;

  // Create appointment
  const apptBody = { customer_id: customerId, pet_id: chosenPetId, branch_id: branchId, employee_id: employeeId, appointment_time: '2025-12-09T11:00:00Z', status: 'Pending', channel: 'Online' };
  const addAppt = await postJson(`${BASE}/appointments/add-appointment`, apptBody);
  console.log('Add Appointment:', JSON.stringify(addAppt.json, null, 2));
  const apptId = addAppt?.json?.data?.fnc_insert_appointment || null;

  // Add a service to appointment
  if (apptId) {
    const addSvc = await postJson(`${BASE}/appointments/add-service`, { appointment_id: apptId, service_id: serviceId });
    console.log('Add Service:', JSON.stringify(addSvc.json, null, 2));
  } else {
    console.log('Skip add-service: missing appointment id');
  }

  // List services for appointment
  if (apptId) {
    const apptSvcs = await getJson(`${BASE}/appointments/services/${apptId}`);
    console.log('Appointment Services:', JSON.stringify(apptSvcs.json, null, 2));
  }

  // List appointments
  const appts = await getJson(`${BASE}/appointments/get-appointment-list?status=Pending`);
  console.log('Appointments:', JSON.stringify(appts.json, null, 2));
  console.log('=== KB1 FLOW END ===\n');
}

async function runKB3() {
  console.log('\n=== KB3 STATUS UPDATE START ===');
  // Find any appointment from list
  const appts = await getJson(`${BASE}/appointments/get-appointment-list`);
  const apptId = appts?.json?.data?.[0]?.appointment_id || null;
  console.log('Appointments (head):', JSON.stringify(appts.json?.data?.slice(0, 1) || [], null, 2));
  if (apptId) {
    const upd = await patchJson(`${BASE}/appointments/update-status`, { appointment_id: apptId, status: 'Confirmed' });
    console.log('Update Status:', JSON.stringify(upd.json, null, 2));
  } else {
    console.log('Skip update-status: no appointment available');
  }
  console.log('=== KB3 STATUS UPDATE END ===\n');
}

async function runKB5() {
  console.log('\n=== KB5 PRODUCTS START ===');
  // All for branch
  const byBranch = await getJson(`${BASE}/products/get-products-by-branch/1`);
  console.log('Products by Branch:', JSON.stringify(byBranch.json, null, 2));
  // Filter by type
  const byType = await getJson(`${BASE}/products/get-products-by-branch/1?product_type=Vaccine`);
  console.log('Products by Type:', JSON.stringify(byType.json, null, 2));
  // Search by name
  const byName = await getJson(`${BASE}/products/search-product-by-name-in-branch/1?product_name=Vaccine%20Bordetella`);
  console.log('Products by Name:', JSON.stringify(byName.json, null, 2));
  // All across branches
  const all = await getJson(`${BASE}/products/get-all-products`);
  console.log('All Products:', JSON.stringify(all.json, null, 2));
  console.log('=== KB5 PRODUCTS END ===\n');
}

(async () => {
  try {
    // Health check first
    const health = await getJson(`${BASE}/health`);
    console.log('Health:', JSON.stringify(health.json, null, 2));
    // Run KB flows
    await runKB1();
    await runKB3();
    await runKB5();
  } catch (err) {
    console.error('Runner error:', err.message || err);
    process.exit(1);
  }
})();

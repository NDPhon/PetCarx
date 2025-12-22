const mongoose = require('mongoose');
const Pet = require('./models/Pet');
const Customer = require('./models/Customer');
const Product = require('./models/Product');
const Vaccine = require('./models/Vaccine');
require('dotenv').config();

const seedData = async () => {
  try {
    // Clear existing data
    await Pet.deleteMany();
    await Customer.deleteMany();
    await Product.deleteMany();
    await Vaccine.deleteMany();

    // Seed pets
    const pets = [
      {
        name: 'Mèo Mimi',
        type: 'Mèo',
        age: 2,
        ownerName: 'Nguyễn Văn A',
        ownerPhone: '0123-456-789',
        ownerEmail: 'nguyenvana@email.com'
      },
      {
        name: 'Chó Max',
        type: 'Chó',
        age: 3,
        ownerName: 'Trần Thị B',
        ownerPhone: '0987-654-321',
        ownerEmail: 'tranthib@email.com'
      },
      {
        name: 'Chim Kiwi',
        type: 'Chim',
        age: 1,
        ownerName: 'Lê Văn C',
        ownerPhone: '0456-789-123',
        ownerEmail: 'levanc@email.com'
      }
    ];

    const createdPets = await Pet.insertMany(pets);

    // Seed customers
    const customers = [
      {
        name: 'Nguyễn Văn A',
        phone: '0123-456-789',
        email: 'nguyenvana@email.com',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        pets: [createdPets[0]._id]
      },
      {
        name: 'Trần Thị B',
        phone: '0987-654-321',
        email: 'tranthib@email.com',
        address: '456 Đường XYZ, Quận 2, TP.HCM',
        pets: [createdPets[1]._id]
      }
    ];

    await Customer.insertMany(customers);

    // Seed products
    const products = [
      {
        name: 'Thức ăn cho chó',
        category: 'food',
        price: 150000,
        stock: 50,
        description: 'Thức ăn dinh dưỡng cho chó'
      },
      {
        name: 'Thức ăn cho mèo',
        category: 'food',
        price: 140000,
        stock: 45,
        description: 'Thức ăn dinh dưỡng cho mèo'
      },
      {
        name: 'Đồ chơi cho thú cưng',
        category: 'toy',
        price: 50000,
        stock: 30,
        description: 'Đồ chơi vui nhộn cho thú cưng'
      },
      {
        name: 'Nệm cho thú cưng',
        category: 'bed',
        price: 200000,
        stock: 20,
        description: 'Nệm êm ái cho thú cưng'
      }
    ];

    await Product.insertMany(products);

    // Seed vaccines
    const vaccines = [
      {
        name: 'Vaccine dại',
        type: 'Bắt buộc',
        price: 100000,
        stock: 50,
        description: 'Vaccine phòng bệnh dại',
        dosage: '1ml',
        schedule: 'Hàng năm'
      },
      {
        name: 'Vaccine tổng hợp',
        type: 'Khuyến nghị',
        price: 150000,
        stock: 30,
        description: 'Vaccine phòng nhiều bệnh',
        dosage: '1ml',
        schedule: 'Hàng năm'
      },
      {
        name: 'Vaccine ký sinh trùng',
        type: 'Phòng ngừa',
        price: 80000,
        stock: 40,
        description: 'Vaccine phòng ve, bọ chét',
        dosage: '0.5ml',
        schedule: 'Hàng quý'
      }
    ];

    await Vaccine.insertMany(vaccines);

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Connect to MongoDB and seed
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/petcarx', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected for seeding');
  seedData();
})
.catch(err => console.log(err));
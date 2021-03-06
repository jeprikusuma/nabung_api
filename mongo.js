// insert users
db.users.insertMany([
    {
        "name": "Admin",
        "role": "admin",
        "password": "1234"
    },
    {
        "name": "Komang Jepri Kusuma Jaya",
        "telp": "123",
        "tl": "01-04-2001",
        "role": "pustakawan",
        "password": "1234"
    },
    {
        "name": "Putu Zasya Eka Satya",
        "telp": "1234",
        "tl": "18-09-2000",
        "role": "mahasiswa",
        "password": "1234"
    },
    {
        "name": "Ngurah Putu Putra Adnyana",
        "telp": "12345",
        "tl": "10-06-1999",
        "role": "mahasiswa",
        "password": "1234"
    }
])
// insert books
db.books.insertMany([
    {
        "_id": 1,
        "title": "Dongeng Favorit si Kancil",
        "author": ["Astri Damayanti"],
        "publisher": "Indria Pustaka",
        "year": 2010,
        "pages": 150,
        "total": 5
    },
    {
        "_id": 2,
        "title": "Kaum Novel Ketabahan dan Derita",
        "author": ["Setyaningsih","Widyanuari Eko Putra"],
        "publisher": "Basabasi",
        "year": 2019,
        "pages": 164,
        "total": 1
    },
    {
        "_id": 3,
        "title": "Filsafat Sejarah Profetik, Spekulatif, dan Kritis",
        "author": ["Ajid Thohir,","Ahmad Sahidin"],
        "publisher": "Prenada Media",
        "year": 2019,
        "pages": 304,
        "total": 10
    },
    {
        "_id": 4,
        "title": "Ragam Tulisan Tentang Pancasila",
        "author": ["Ina Magdalena", "dkk"],
        "publisher": "CV Jejak (Jejak Publisher)",
        "year": 2019,
        "pages": 192,
        "total": 9
    },
    {
        "_id": 5,
        "title": "Pengantar Teknologi Informatika dan Komunikasi Data",
        "author": ["Bagaskoro"],
        "publisher": "Deepublish",
        "year": 2019,
        "pages": 134,
        "total": 7
    }
])

// Read user
db.users.find().pretty()
db.users.find({name: /Jepri/}).pretty()
// Read blog
db.books.find().pretty()
db.books.find({pages : {$gt: 150}}).pretty()


// update
db.users.updateMany(
    {role: "mahasiswa"},
    {$set: {role: "pengunjung"}}
)
db.books.updateOne(
    {_id: 4},
    {$inc: {total: -2}}
    )
// delete
db.users.deleteOne({role: "pengunjung"})
db.books.deleteMany({year: 2019})

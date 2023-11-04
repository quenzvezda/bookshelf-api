const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    // Destructuring assignment untuk mendapatkan properti yang dibutuhkan dari request.payload
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    // Validasi untuk name
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    // Mengecek apakah pageCount lebih besar atau sama dengan readPage
    if (pageCount < readPage) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const id = nanoid(16); // Menghasilkan ID unik
    const insertedAt = new Date().toISOString(); // Mendapatkan tanggal dan waktu saat ini dalam format ISO string
    const updatedAt = insertedAt;
    const finished = pageCount === readPage; // Jika pageCount sama dengan readPage, maka buku dianggap telah selesai dibaca

    // Membuat objek buku baru
    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    // Menambahkan buku baru ke dalam array books
    books.push(newBook);

    // Mengecek apakah buku berhasil ditambahkan
    const isSuccess = books.some((book) => book.id === id);

    // Jika buku berhasil ditambahkan
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201); // Mengirimkan status code 201 untuk created
        return response;
    } else { // Jika buku gagal ditambahkan
        const response = h.response({
            status: 'error',
            message: 'Buku gagal ditambahkan',
        });
        response.code(500); // Mengirimkan status code 500 untuk internal server error
        return response;
    }
};

const getAllBooksHandler = (request, h) => ({
    status: 'success',
    data: {
        books,
    },
});

module.exports = { addBookHandler, getAllBooksHandler }; // Eksport handler agar bisa digunakan di file lain

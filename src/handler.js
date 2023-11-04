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

const getAllBooksHandler = (request, h) => {
    // Mengambil hanya properti id, name, dan publisher dari setiap buku
    const simplifiedBooks = books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));

    // Membuat response dengan status 'success' dan data berisi array books
    const response = h.response({
        status: 'success',
        data: {
            books: simplifiedBooks, // Pastikan array ini memiliki dua buku jika ingin test ke-5 berhasil
        },
    });
    response.code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    // Gunakan request.params.bookId, bukan request.params.id
    const { bookId } = request.params;

    const book = books.filter((b) => b.id === bookId)[0]; // Dapatkan buku berdasarkan bookId

    // Periksa apakah buku ditemukan
    if (book) {
        return {
            status: 'success',
            data: {
                book,
            }
        };
    }

    // Jika buku tidak ditemukan, kembalikan response dengan status 404
    return h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    }).code(404);
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading
    } = request.payload;

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);
    }

    const index = books.findIndex((book) => book.id === bookId);

    if (index === -1) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        }).code(404);
    }

    const updatedAt = new Date().toISOString();

    books[index] = {
        ...books[index],
        name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt,
    };

    return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
    }).code(200);
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
}; // Eksport handler agar bisa digunakan di file lain

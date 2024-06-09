import Swal from 'sweetalert2'


export const errorAlert = (title: string, msg: string) => {
    Swal.fire({
        title,
        text: msg,
        icon: 'error',
        confirmButtonText: '好的',
    })
} 
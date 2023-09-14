import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {

    getAllUsers() {
        return[
            {
                id: "41jn413j10",
                userName: "gervajac"
            }
        ]
    }
    createUser() {}
    updateUser() {}
    deleteUser() {}

}

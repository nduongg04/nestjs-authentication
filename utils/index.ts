import { User, UserWithId, UserWithoutPassword } from 'src/users/schema';

export const removePasswordField = (user: UserWithId): UserWithoutPassword => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

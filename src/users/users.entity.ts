import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: 'users'
})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
 
    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true
    })
    username: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false
    })
    password: string;

    @Column({
        name: 'refresh_token',
        type: 'varchar',
        length: 255,
        nullable: true
    })
    refreshToken?: string;

    @OneToMany(() => BucketList, (bucketList) => bucketList.user)
    bucketLists: BucketList[];
}

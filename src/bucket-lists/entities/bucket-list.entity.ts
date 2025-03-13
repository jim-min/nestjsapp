import { User } from "src/users/users.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BucketListItem } from "src/bucket-list-items/entities/bucket-list-item.entity";

@Entity()
export class BucketList {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false
    })
    name: string;

    @ManyToOne(() => User, (user) => user.bucketLists)
    user: User;

    @OneToMany(() => BucketListItem, (bucketListItem) => bucketListItem.bucketList)
    items: BucketListItem[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { User } from './User';
import { v4 as uuidv4 } from 'uuid';

@Entity('user_tokens')
class UserToken {
  constructor() {
    if (!this.id) {
        this.id = uuidv4();
    }
}

  @PrimaryColumn()
  id: string;

  @Column()
  refresh_token: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  expires_date: Date;

  @CreateDateColumn()
  // eslint-disable-next-line camelcase
  created_at: Date;

  @UpdateDateColumn()
  // eslint-disable-next-line camelcase
  updated_at: Date;
}

export default UserToken;
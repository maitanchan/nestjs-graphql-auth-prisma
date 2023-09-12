import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class RegisterInput {

    @Field()
    @IsNotEmpty()
    @IsString()
    name: string

    @Field()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @Field()
    @IsNotEmpty()
    @IsString()
    password: string

}
create database sketchup;

use sketchup;

create table user (
	idUser int primary key auto_increment unique,
    firstName varchar(45),
    userName varchar(45),
    email varchar(120),
    password char(8),
    registerData datetime
);

create table draw (
	idDraw int auto_increment unique,
    fkUser int,
    constraint fkUserDraw foreign key (fkUser) references user(idUser),
    constraint pkComposta primary key (idDraw, fkUser),
    draw blob,
    createData datetime,
    fkComunityGalery int unique,
    constraint fkComunityGaleryDraw foreign key (fkComunityGalery) references comunityGalery(idComunityGalery)
);

create table draw (
	idDraw int auto_increment unique,
    fkUser int,
    constraint fkUserDraw foreign key (fkUser) references user(idUser),
    constraint pkComposta primary key (idDraw, fkUser),
    draw blob,
    createData datetime,
    fkComunityGalery int,
    constraint fkComunityGaleryDraw foreign key (fkComunityGalery) references comunityGalery(idComunityGalery)
);

create table comunityGalery (
	idcomunityGalery int primary key auto_increment unique,
    postData datetime
);
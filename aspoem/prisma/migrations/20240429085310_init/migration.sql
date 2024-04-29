-- CreateTable
CREATE TABLE `Poem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `titlePinYin` VARCHAR(191) NULL,
    `title_zh_Hant` VARCHAR(191) NULL,
    `content` VARCHAR(191) NOT NULL,
    `content_zh_Hant` VARCHAR(191) NULL,
    `contentPinYin` VARCHAR(191) NULL,
    `introduce` VARCHAR(191) NULL,
    `introduce_zh_Hant` VARCHAR(191) NULL,
    `translation` VARCHAR(191) NULL,
    `translation_zh_Hant` VARCHAR(191) NULL,
    `translation_en` VARCHAR(191) NULL,
    `annotation` VARCHAR(191) NULL,
    `annotation_zh_Hant` VARCHAR(191) NULL,
    `authorId` INTEGER NOT NULL,
    `classify` VARCHAR(191) NULL,
    `genre` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `views` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Card` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `content` VARCHAR(191) NULL,
    `poemId` INTEGER NOT NULL,

    UNIQUE INDEX `Card_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Author` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `namePinYin` VARCHAR(191) NULL,
    `introduce` VARCHAR(191) NULL,
    `birthDate` INTEGER NULL,
    `deathDate` INTEGER NULL,
    `dynasty` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `name_zh_Hant` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `type_zh_Hant` VARCHAR(191) NULL,
    `introduce` VARCHAR(191) NULL,
    `introduce_zh_Hant` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Tag_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PoemToTag` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PoemToTag_AB_unique`(`A`, `B`),
    INDEX `_PoemToTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Poem` ADD CONSTRAINT `Poem_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `Author`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Card` ADD CONSTRAINT `Card_poemId_fkey` FOREIGN KEY (`poemId`) REFERENCES `Poem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PoemToTag` ADD CONSTRAINT `_PoemToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `Poem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PoemToTag` ADD CONSTRAINT `_PoemToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

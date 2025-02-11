// Copyright 2013 Ardan Studios. All rights reserved.
// Use of controller source code is governed by a BSD-style
// license that can be found in the LICENSE handle.

// Package controllers implements the controller layer for the buoy API.
package controllers

import (
	log "github.com/goinggo/tracelog"
	bc "github.com/liuhong1happy/ConsoleWindowApp/controllers/baseController"
	"github.com/liuhong1happy/ConsoleWindowApp/services/fileService"
    "github.com/liuhong1happy/ConsoleWindowApp/models/fileModels"
    "os"
)

//** TYPES

// BuoyController manages the API for buoy related functionality.
type UploadFileController struct {
	bc.BaseController
}

func (controller *UploadFileController) GetHashFile() {
	// The call to ParseForm inside of ParseAndValidate is failing. This is a BAD FIX
	params := struct {
		Hash string `form:":hash" valid:"Required; MinSize(4)" error:"not hash"`
	}{controller.GetString(":hash")}

	if controller.ParseAndValidate(&params) == false {
		return
	}

	fileInfo, err := fileService.FindFileByHash(&controller.Service, params.Hash)
	if err != nil {
		log.CompletedErrorf(err, controller.UserID, "File", "Hash[%s]", params.Hash)
		controller.ServeError(err)
		return
	}

	controller.Data["json"] = fileInfo
	controller.ServeJSON()
}

func (controller *UploadFileController) GetHashFiles() {
	// The call to ParseForm inside of ParseAndValidate is failing. This is a BAD FIX
	params := struct {
		HashArray string `form:":hash_array" valid:"Required; MinSize(4)" error:"not hash array"`
	}{controller.GetString(":hash_array")}

	if controller.ParseAndValidate(&params) == false {
		return
	}

	filesInfo, err := fileService.FindFilesByHash(&controller.Service, params.HashArray)
	if err != nil {
		log.CompletedErrorf(err, controller.UserID, "Files", "HashArray[%s]", params.HashArray)
		controller.ServeError(err)
		return
	}

	controller.Data["json"] = filesInfo
	controller.ServeJSON()
}

func (controller *UploadFileController) UploadFile() {
	var params struct {
		FileName         string `form:"file_name" valid:"Required; MinSize(4)" error:"invalid_file_name"`
		FileHash         string `form:"file_hash" valid:"Required; MinSize(6)" error:"invalid_file_hash"`
		FileSize         int    `form:"file_size" valid:"Required;" error:"invalid_file_size"`
		Start            int64    `form:"start" valid:"Required;" error:"invalid_start"`
		Length           int    `form:"length" valid:"Required;" error:"invalid_length"`
		LastModifiedDate string `form:"last_modified_date" valid:"Required;" error:"invalid_last_modified_date"`
		VisualPath       string `form:"visual_path" valid:"Required;" error:"invalid_visual_path"`
	}

	if controller.ParseAndValidate(&params) == false {
		return
	}
    fileInfo := fileModels.FileInfo{}
    if err := controller.ParseForm(&fileInfo); err != nil {
        return
    }
	var tofile = "/var/files/" + params.LastModifiedDate + "/" + params.FileHash

    file, _, err := controller.GetFile("file")
	// 做后续的处理
	if err != nil {
		return
	}
	defer file.Close()
	f, err := os.OpenFile(tofile, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0666)
	if err != nil {
		return
	}
	defer f.Close()

	buf := make([]byte, params.Length)
	n, err := file.Read(buf)
	if err != nil && n==0 {
		return
	}
	f.WriteAt(buf, params.Start)
	// 成功保存过后返回结果
	finfo, err := fileService.SaveFile(&controller.Service, fileInfo)

	controller.Data["json"] = finfo
	controller.ServeJSON()
}
